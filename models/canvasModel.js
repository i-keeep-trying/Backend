const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    elements: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
      default: [],
    },
    shared_with: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

//Get all canvas for a user (both owner and shared with)
canvasSchema.statics.getAllCanvases = async function (email) {
  const user = await mongoose.model('User').findOne({ email });
  try {
    if (!user) {
      throw new Error('User not found');
    }

    const canvases = await this.find({
        $or: [{ owner: user._id }, { shared_with: user._id }],
    }).populate('owner', 'email').populate('shared_with', 'email');
    return canvases;
  } catch (error) {
    throw new Error('Error fetching canvases:' + error.message);
    }    
};

//create a canvas for a user with given email
canvasSchema.statics.createCanvas = async function (email, name) {

  const user = await mongoose.model('User').findOne({ email });
  try {
    if (!user) {
    throw new Error('User not found');
  }

  const newCanvas = new this({
    name,
    owner: user._id,
    elements: [],
    shared_with: [],
  });
  await newCanvas.save();
  return newCanvas;
  } catch (error) {
    return Error('Error creating canvas: ' + error.message);
  }
};

canvasSchema.statics.loadCanvas = async function (email, id) {
  const user = await mongoose.model('User').findOne({ email });
  try {
    if (!user) {
      throw new Error('User not found');
    }

    const canvas = await this.findOne({
      _id: id,
      $or: [{ owner: user._id }, { shared_with: user._id }],
    }).populate('owner', 'email').populate('shared_with', 'email');

    if (!canvas) {
      throw new Error('Canvas not found');
    }
    return canvas;
  } catch (error) {
    throw new Error('Error loading canvas: ' + error.message);
  }
};

canvasSchema.statics.updateCanvas = async function (email, id, elements) {
  const user = await mongoose.model('User').findOne({ email });
  try {
    if (!user) {
      throw new Error('User not found');
    }

    //check if the canvas belongs to the user or is shared to the user
    const canvas = await this.findOne({ _id: id, $or: [{ owner: user._id }, { shared_with: user._id }] });
    if (!canvas) {
      throw new Error('Canvas not found or you do not have permission to update it');
    }

    canvas.elements = elements;
    await canvas.save();
    return canvas;
  } catch (error) {
    throw new Error('Error updating canvas: ' + error.message);
  }
};

// Add email to shared_with array of canvas
canvasSchema.statics.shareCanvas = async function (email, canvasId, userEmail) {
  const user = await mongoose.model('User').findOne({ email });
  const sharedUser = await mongoose.model('User').findOne({ email: userEmail });
  try {
    if (!user) {
      throw new Error('User not found');
    }
    if (!sharedUser) {
      throw new Error('Shared user not found');
    }

    const canvas = await this.findOne({ _id: canvasId, owner: user._id });
    if (!canvas) {
      throw new Error('Canvas not found or you do not have permission to share it');
    }

    // Check if the user is already shared
    if (canvas.shared_with.includes(sharedUser._id)) {
      throw new Error('Canvas is already shared with this user');
    }

    canvas.shared_with.push(sharedUser._id);
    await canvas.save();
    return canvas;
  } catch (error) {
    throw new Error('Error sharing canvas: ' + error.message);
  }
};

const Canvas = mongoose.model('Canvas', canvasSchema);
module.exports = Canvas;
