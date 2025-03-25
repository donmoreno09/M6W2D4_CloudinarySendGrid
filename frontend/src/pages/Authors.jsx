import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/authors');
      setAuthors(response.data);
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento degli autori:', err);
      setError('Errore nel caricamento degli autori');
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo autore?')) {
      try {
        await axios.delete(`http://localhost:3001/authors/${id}`);
        fetchAuthors();
      } catch (err) {
        console.error('Errore durante l\'eliminazione:', err);
        setError('Errore durante l\'eliminazione dell\'autore');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/authors/edit/${id}`);
  };

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container className="mt-4">
      <h2>Lista Autori</h2>
      <Row>
        {authors.map(author => (
          <Col key={author._id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={author.profile} alt={author.name} />
              <Card.Body>
                <Card.Title>{author.name} {author.lastName}</Card.Title>
                <Card.Text>{author.email}</Card.Text>
                <ButtonGroup className="d-flex gap-2">
                  <Button variant="primary" onClick={() => handleEdit(author._id)}>
                    Modifica
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(author._id)}>
                    Elimina
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Authors; 