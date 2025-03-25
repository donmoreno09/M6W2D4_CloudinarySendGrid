import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditBlog = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    readTime: {
      value: 0,
      unit: 'minuti'
    },
    cover: null,
    author: ''
  });
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBlog = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/blogs/${id}`);
      const blog = response.data;
      console.log('Blog ricevuto:', blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        readTime: blog.readTime,
        cover: null,
        author: blog.author?._id || ''
      });
    } catch (err) {
      console.error('Errore nel caricamento del blog:', err);
      setError(`Errore nel caricamento del blog: ${err.response?.data?.message || err.message}`);
    }
  }, [id]);

  const fetchAuthors = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/authors');
      setAuthors(response.data);
    } catch (err) {
      console.error('Errore nel caricamento degli autori:', err);
      setError('Errore nel caricamento degli autori');
    }
  }, []);

  useEffect(() => {
    fetchBlog();
    fetchAuthors();
  }, [fetchBlog, fetchAuthors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('readTime[value]', formData.readTime.value);
      formDataToSend.append('readTime[unit]', formData.readTime.unit);
      formDataToSend.append('author', formData.author);
      if (formData.cover) {
        formDataToSend.append('cover', formData.cover);
      }

      await axios.put(`http://localhost:3001/blogs/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/blogs');
    } catch (err) {
      console.error('Errore durante l\'aggiornamento:', err);
      setError(err.response?.data?.message || 'Errore durante l\'aggiornamento del blog');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'cover') {
      setFormData({ ...formData, cover: e.target.files[0] });
    } else if (e.target.name.startsWith('readTime.')) {
      const field = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        readTime: { ...formData.readTime, [field]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <Container className="mt-4">
      <h2>Modifica Blog</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tempo di Lettura</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="number"
              name="readTime.value"
              value={formData.readTime.value}
              onChange={handleChange}
              required
              min="1"
            />
            <Form.Select
              name="readTime.unit"
              value={formData.readTime.unit}
              onChange={handleChange}
              required
            >
              <option value="minuti">Minuti</option>
              <option value="ore">Ore</option>
            </Form.Select>
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Autore</Form.Label>
          <Form.Select
            name="author"
            value={formData.author || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona un autore</option>
            {authors.map(author => (
              <option key={author._id} value={author._id}>
                {author.name} {author.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Immagine di Copertina</Form.Label>
          <Form.Control
            type="file"
            name="cover"
            onChange={handleChange}
            accept="image/*"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Aggiorna Blog
        </Button>
      </Form>
    </Container>
  );
};

export default EditBlog; 