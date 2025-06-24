const Canvas = require('../models/canvasModel');

const getAllCanvases = async (req, res) => {
    const email = req.email;

    try {
        const canvases = await Canvas.getAllCanvases(email);
        res.status(200).json(canvases);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//create canvas for a user with given email
const createCanvas = async (req, res) => {
    const email = req.email;
    const { name } = req.body;

    try {
        const newCanvas = await Canvas.createCanvas(email, name);
        res.status(201).json(newCanvas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loadCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;

    try {
        const canvas = await Canvas.loadCanvas(email, id);
        if (!canvas) {
            return res.status(404).json({ error: 'Canvas not found' });
        }
        res.status(200).json(canvas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;
    const { elements } = req.body;

    try {
        const canvas = await Canvas.updateCanvas(email, id, elements);
        if (!canvas) {
            return res.status(404).json({ error: 'Canvas not found' });
        }
        res.status(200).json(canvas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const shareCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;
    const { shared_with } = req.body;
    const sharedWithEmail = shared_with;

    try {
        const canvas = await Canvas.shareCanvas(email, id, sharedWithEmail);
        if (!canvas) {
            return res.status(404).json({ error: 'Canvas not found' });
        }
        res.status(200).json(canvas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;
    try {
        const user = await require('../models/userModel').findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const canvas = await Canvas.findById(id);
        if (!canvas) return res.status(404).json({ error: "Canvas not found" });

        // If owner, delete canvas for everyone
        if (String(canvas.owner) === String(user._id)) {
            await Canvas.findByIdAndDelete(id);
            return res.status(200).json({ message: "Canvas deleted for everyone" });
        }

        // If shared_with, remove user from shared_with
        const wasShared = canvas.shared_with.map(String).includes(String(user._id));
        if (wasShared) {
            canvas.shared_with = canvas.shared_with.filter(
                uid => String(uid) !== String(user._id)
            );
            await canvas.save();
            return res.status(200).json({ message: "Canvas removed from your list" });
        }

        return res.status(403).json({ error: "You do not have permission to delete this canvas" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllCanvases,
    createCanvas,
    loadCanvas,
    updateCanvas,
    shareCanvas,
    deleteCanvas,
}