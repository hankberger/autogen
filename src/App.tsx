import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostForm from './components/PostForm';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo">testing</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create-post">Create Post</Link></li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/create-post" element={<PostForm />} />
          <Route path="/edit-post/:id" element={<PostForm isEditMode={true} />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
