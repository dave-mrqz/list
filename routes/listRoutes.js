// routes/listRoutes.js
const express = require('express');
const router = express.Router();
const List = require('../models/List');

// GET /lists - show all lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });
    // Renders views/lists.ejs
    res.render('lists', { lists });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching lists');
  }
});

// GET /lists/new - show form to create a new list
router.get('/new', (req, res) => {
  // Renders views/new-list.ejs
  res.render('new-list');
});

// POST /lists - handle create list form
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    await List.create({ title });
    // After creating, redirect to all lists
    res.redirect('/lists');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating list');
  }
});

// GET /lists/:id - show a single list
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send('List not found');
    // Renders views/show-list.ejs
    res.render('show-list', { list });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching list');
  }
});

// GET /lists/:id/edit - show edit form for a list
router.get('/:id/edit', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send('List not found');
    // Renders views/edit-list.ejs
    res.render('edit-list', { list });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading edit form');
  }
});

// POST /lists/:id/update - handle update form submit
router.post('/:id/update', async (req, res) => {
  try {
    const { title } = req.body;
    await List.findByIdAndUpdate(req.params.id, { title });
    res.redirect(`/lists/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating list');
  }
});

// POST /lists/:id/delete - delete a list
router.post('/:id/delete', async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.redirect('/lists');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting list');
  }
});

module.exports = router;
