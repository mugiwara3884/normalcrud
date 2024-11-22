const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const methodOverride = require('method-override');  // Import method-override

// Initialize express and the PostgreSQL connection pool
const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crud_app',  // Ensure this matches your actual database
  password: '1234567890',
  port: 5432,
});

// Middleware setup
app.use(bodyParser.json());  // For JSON request bodies
app.use(express.urlencoded({ extended: true }));  // For form submissions
app.use(methodOverride('_method'));  // Enable method overriding with _method query parameter

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve the form on the '/create' route
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle form submission to '/create'
app.post('/create', async (req, res) => {
  const { entry } = req.body;
  try {
    await pool.query('INSERT INTO entries (entry) VALUES ($1)', [entry]);
    res.redirect('/view');  // Redirect to '/view' after entry creation
  } catch (error) {
    console.error('Error inserting into the database:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// View entries
app.get('/view', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM entries');
      const entries = result.rows; // Get all entries from the database
  
      // Pass 'deleted' query param to EJS view
      res.render('view', { entries: entries, deleted: req.query.deleted });
    } catch (error) {
      console.error('Error fetching entries from the database:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  

// Handle DELETE requests for deleting an entry
// This is where the actual DELETE action occurs
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM entries WHERE id = $1', [id]);
      // Redirect to '/view' and pass a success message
      res.redirect('/view?deleted=true');
    } catch (error) {
      console.error('Error deleting from the database:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });


  app.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Fetch the entry by ID
      const result = await pool.query('SELECT * FROM entries WHERE id = $1', [id]);
      const entry = result.rows[0]; // Get the entry to update
      if (!entry) {
        return res.status(404).send('Entry not found');
      }
  
      // Render the update form with the entry data
      res.render('update', { entry: entry });
    } catch (error) {
      console.error('Error fetching entry from the database:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  // Handle the form submission to update the entry
  app.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { entry } = req.body;
    try {
      // Update the entry in the database
      await pool.query('UPDATE entries SET entry = $1 WHERE id = $2', [entry, id]);
  
      // Redirect to view with a success message
      res.redirect('/view');
    } catch (error) {
      console.error('Error updating entry in the database:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
