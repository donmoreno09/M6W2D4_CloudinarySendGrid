import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditAuthor = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    birthDate: '',
    avatar: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAuthor = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/authors/${id}`);
      const author = response.data;
      setFormData({
        name: author.name,
        lastName: author.lastName,
        email: author.email,
        birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] : '',
        avatar: null
      });
    } catch (err) {
      console.error('Errore nel caricamento dell\'autore:', err);
      setError('Errore nel caricamento dell\'autore');
    }
  }, [id]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('birthDate', formData.birthDate);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      await axios.put(`http://localhost:3001/authors/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/authors');
    } catch (err) {
      console.error('Errore durante l\'aggiornamento:', err);
      setError(err.response?.data?.message || 'Errore durante l\'aggiornamento dell\'autore');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <Container className="mt-4">
      <h2>Modifica Autore</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data di Nascita</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Aggiorna Autore
        </Button>
      </Form>
    </Container>
  );
};

export default EditAuthor; 