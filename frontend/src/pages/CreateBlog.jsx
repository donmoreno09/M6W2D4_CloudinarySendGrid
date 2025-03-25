import { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    readTime: { value: 1, unit: 'minuti' },
    author: ''
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/authors');
        setAuthors(response.data);
      } catch (err) {
        setError('Errore nel caricamento degli autori');
      }
    };
    fetchAuthors();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Controllo che tutti i campi siano compilati
    console.log('FormData prima del controllo:', formData);
    if (!formData.title || !formData.content || !formData.category || !formData.author) {
      console.log('Campi mancanti:', {
        title: !formData.title,
        content: !formData.content,
        category: !formData.category,
        author: !formData.author
      });
      setError('Tutti i campi sono obbligatori.');
      return;
    }

    if (!coverImage) {
      setError("L'immagine di copertina è obbligatoria.");
      return;
    }

    try {
      const blogData = new FormData();
      blogData.append('title', formData.title);
      blogData.append('content', formData.content);
      blogData.append('category', formData.category);
      blogData.append('author', formData.author);
      blogData.append('readTime', JSON.stringify({
        value: parseInt(formData.readTime.value),
        unit: formData.readTime.unit
      }));
      blogData.append('cover', coverImage);

      // Log per debug (verifica che i dati siano corretti)
      for (let pair of blogData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const response = await axios.post('http://localhost:3001/blogs', blogData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        navigate('/blogs');
      }
    } catch (err) {
      console.error('Errore durante la creazione:', err);
      setError(err.response?.data?.error || 'Errore durante la creazione del blog');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Crea Nuovo Blog</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Autore</Form.Label>
          <Form.Select
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {previewUrl && (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="mt-2" 
              style={{maxWidth: '200px'}} 
            />
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tempo di Lettura</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="number"
              value={formData.readTime.value}
              onChange={(e) => setFormData({ 
                ...formData, 
                readTime: { ...formData.readTime, value: parseInt(e.target.value) || 1 }
              })}
              required
              min="1"
            />
            <Form.Select
              value={formData.readTime.unit}
              onChange={(e) => setFormData({
                ...formData,
                readTime: { ...formData.readTime, unit: e.target.value }
              })}
            >
              <option value="minuti">Minuti</option>
              <option value="ore">Ore</option>
            </Form.Select>
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          Crea Blog
        </Button>
      </Form>
    </Container>
  );
};

export default CreateBlog;
