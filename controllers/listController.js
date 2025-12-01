const List = require('../models/List');

// Show "create list" page
exports.showNewListForm = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Create List</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Create a New List</h1>
      <form action="/lists" method="POST">
        <label>List Name:</label>
        <input type="text" name="name" required>
        <button type="submit">Create List</button>
      </form>
      <br>
      <a href="/">Back to Home</a>
    </body>
    </html>
  `);
};

// Handle creating a new list
exports.createList = async (req, res) => {
  try {
    const { name } = req.body;
    await List.create({ name, items: [] });
    res.redirect('/lists');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating list');
  }
};

// Show all lists
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });

    const listItems = lists
      .map(
        (list) => `
          <li>
            ${list.name}
            <a href="/lists/${list._id}">
              <button>Open</button>
            </a>
          </li>
        `
      )
      .join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>All Lists</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>All Lists</h1>
        <ul>
          ${listItems || '<p>No lists yet. <a href="/lists/new">Create one</a>.</p>'}
        </ul>
        <br>
        <a href="/">Back to Home</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading lists');
  }
};

// Show a single list and its items
exports.getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send('List not found');

    const itemsHtml = list.items
      .map(
        (item, index) => `
          <li>
            ${item}
            <form action="/lists/${list._id}/items/${index}/delete" method="POST" style="display:inline;">
              <button type="submit">Remove</button>
            </form>
          </li>
        `
      )
      .join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${list.name}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>${list.name}</h1>

        <h2>Items</h2>
        <ul>
          ${itemsHtml || '<p>No items yet.</p>'}
        </ul>

        <h3>Add Item</h3>
        <form action="/lists/${list._id}/items" method="POST">
          <input type="text" name="item" required>
          <button type="submit">Add</button>
        </form>

        <br>
        <a href="/lists">Back to All Lists</a> |
        <a href="/">Home</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading list');
  }
};

// Add an item to a list
exports.addItemToList = async (req, res) => {
  try {
    const { item } = req.body;
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send('List not found');

    list.items.push(item);
    await list.save();
    res.redirect(`/lists/${list._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding item');
  }
};

// Remove an item from a list
exports.removeItemFromList = async (req, res) => {
  try {
    const { id, itemIndex } = req.params;
    const list = await List.findById(id);
    if (!list) return res.status(404).send('List not found');

    list.items.splice(itemIndex, 1);
    await list.save();
    res.redirect(`/lists/${list._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing item');
  }
};
