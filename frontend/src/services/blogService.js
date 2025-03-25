import api from '../utils/axios';

export const blogService = {
  // Ottieni tutti i blog
  getAllBlogs: () => api.get('/blogs'),
  
  // Ottieni un singolo blog
  getBlogById: (id) => api.get(`/blogs/${id}`),
  
  // Crea un nuovo blog
  createBlog: (data) => api.post('/blogs', data),
  
  // Aggiorna un blog
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  
  // Elimina un blog
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  
  // Aggiorna la cover di un blog
  updateBlogCover: (blogId, formData) => api.patch(`/blogs/${blogId}/cover`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
}; 