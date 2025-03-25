import express from 'express';
import multer from 'multer';
import uploadCloudinary from '../middlewares/uploadCloudinary.js';
import Blog from '../models/Blog.js';
import Author from '../models/Author.js';
import mailer from '../helpers/mailer.js';

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author');
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new blog con gestione file
router.post('/', uploadCloudinary.single('cover'), async (req, res) => {
  try {
    /* console.log('Dati ricevuti:', req.body);
    console.log('File ricevuto:', req.file); */

    if (!req.file) {
      return res.status(400).json({ error: "L'immagine di copertina è obbligatoria" });
    }

    const { title, content, category, author, readTime } = req.body;

    if (!title || !content || !category || !author || !readTime) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    const parsedReadTime = JSON.parse(readTime);

    const newBlog = await Blog.create({
      title,
      content,
      category,
      author,
      readTime: parsedReadTime,
      cover: req.file.path
    });

    const authorData = await Author.findById(newBlog.author);

    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to: authorData.email,
      subject: 'Il tuo nuovo post è stato pubblicato!',
      text: `Ciao ${authorData.name}, il tuo post "${newBlog.title}" è stato pubblicato con successo!`,
      html: `<h1>Ciao ${authorData.name}!</h1><p>Il tuo post "${newBlog.title}" è stato pubblicato con successo!</p>`
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error("Errore nella creazione del blog:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT (update) a blog by ID
router.put('/:id', uploadCloudinary.single('cover'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.cover = req.file.path;
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a blog by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /blogs/:blogId/cover
// router.patch('/:blogId/cover', uploadCloudinary.single('cover'), async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const { secure_url } = req.file;

//     const updatedBlog = await Blog.findByIdAndUpdate(
//       blogId,
//       { cover: secure_url },
//       { new: true }
//     );

//     if (!updatedBlog) {
//       return res.status(404).json({ message: 'Blog non trovato' });
//     }

//     res.json(updatedBlog);
//   } catch (error) {
//     res.status(500).json({ message: 'Errore durante l\'aggiornamento della cover' });
//   }
// });

export default router; 