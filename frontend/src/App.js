import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavigationBar from './components/Navbar';
import Authors from './pages/Authors';
import CreateAuthor from './pages/CreateAuthor';
import EditAuthor from './pages/EditAuthor';
import Blogs from './pages/Blogs';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Container className="mt-4">
                <Routes>
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/create-author" element={<CreateAuthor />} />
                    <Route path="/authors/edit/:id" element={<EditAuthor />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/create-blog" element={<CreateBlog />} />
                    <Route path="/blogs/edit/:id" element={<EditBlog />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;