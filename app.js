const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const postsDir = path.join(__dirname, 'posts');

// Set up view engine as EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Route - List all posts
app.get('/', (req, res) => {
  fs.readdir(postsDir, (err, files) => {
    if (err) throw err;
    res.render('index', { posts: files });
  });
});

// New Post Route - Display form for creating a new post
app.get('/new', (req, res) => {
  res.render('new');
});

// Create Post Route - Save new post as a file
app.post('/create', (req, res) => {
  const postTitle = req.body.title;
  const postContent = req.body.content;
  const postPath = path.join(postsDir, postTitle + '.txt');

  fs.writeFile(postPath, postContent, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Read Post Route - Display a single blog post
app.get('/post/:title', (req, res) => {
  const postPath = path.join(postsDir, req.params.title + '.txt');
  
  fs.readFile(postPath, 'utf8', (err, data) => {
    if (err) throw err;
    res.render('post', { title: req.params.title, content: data });
  });
});

// Edit Post Route - Display form for editing a post
app.get('/edit/:title', (req, res) => {
  const postPath = path.join(postsDir, req.params.title + '.txt');

  fs.readFile(postPath, 'utf8', (err, data) => {
    if (err) throw err;
    res.render('edit', { title: req.params.title, content: data });
  });
});

// Update Post Route - Save updated post
app.post('/update/:title', (req, res) => {
  const postPath = path.join(postsDir, req.params.title + '.txt');

  fs.writeFile(postPath, req.body.content, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Delete Post Route - Delete a blog post
app.post('/delete/:title', (req, res) => {
  const postPath = path.join(postsDir, req.params.title + '.txt');

  fs.unlink(postPath, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Ensure posts directory exists
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir);
}

// Start the server
const port = 3000;
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
