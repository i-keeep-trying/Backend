const express = require("express");
const router = express.Router();
const { getAllCanvases,  createCanvas, loadCanvas, updateCanvas, shareCanvas, deleteCanvas } = require("../controllers/canvasController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get('/', authMiddleware, getAllCanvases);
router.post('/', authMiddleware, createCanvas);
router.get('/load/:id', authMiddleware, loadCanvas);
router.put('/:id', authMiddleware, updateCanvas);
router.put('/share/:id', authMiddleware, shareCanvas);
router.delete('/:id', authMiddleware, deleteCanvas);
module.exports = router;