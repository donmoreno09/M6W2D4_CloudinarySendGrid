import api from '../utils/axios';

export const authorService = {
  // Ottieni tutti gli autori
  getAllAuthors: () => api.get('/authors'),
  
  // Ottieni un singolo autore
  getAuthorById: (id) => api.get(`/authors/${id}`),
  
  // Crea un nuovo autore
  createAuthor: (formData) => api.post('/authors', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Aggiorna un autore
  updateAuthor: (id, data) => api.put(`/authors/${id}`, data),
  
  // Elimina un autore
  deleteAuthor: (id) => api.delete(`/authors/${id}`),
  
  // Aggiorna l'avatar di un autore
  updateAuthorAvatar: (id, formData) => api.patch(`/authors/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
}; 