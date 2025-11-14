const express = require('express');
const router = express.Router();
const Wine = require('../models/Wine');

router.get('/', async (req, res) => {
  try {
    const wines = await Wine.find().sort({ createdAt: -1 });
    res.json(wines);
  } catch (err) {
    res.status(500).json({ message: 'Error getting wines' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const newWine = new Wine({ name, description, price, image });
    await newWine.save();
    res.json(newWine);
  } catch (err) {
    res.status(500).json({ message: 'Error adding wine' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Wine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Wine deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting wine' });
  }
});

module.exports = router;
