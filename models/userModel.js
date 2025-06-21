const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 50
 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare password for login
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

userSchema.statics.register = async function (name, email, password) {
  try {
    //validate email and password
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error('Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.');
    }

    //generate salt and hash ppassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating the user with hashed password
    const user = new this({ name, email, password:hashedPassword });
    await user.save();
    return user;
    } catch (error) {
    throw new Error('Error registering user: ' + error.message);
    };
};

userSchema.statics.getUser = async function (email) {
  try {
    return await this.findOne({ email });
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

userSchema.statics.login = async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('Invalid login credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid login credentials');
        }
        return user;
    } catch (error) {
        throw new Error('Error logging in: ' + error.message);
    }
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
