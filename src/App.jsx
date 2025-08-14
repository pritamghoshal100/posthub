import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import BlogPost from './components/BlogPost';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { IoMdAdd } from "react-icons/io";

function Navigation() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="App-header">
      <div className='header-wrapper-div'>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1>PostHub</h1>
        </Link>
      </div>
      <nav className='nav'>
        <Link to="/">Home</Link>
        {currentUser ? (
          <button onClick={logout} className="auth-btn">Log Out</button>
        ) : (
          <Link to="/login" className="auth-btn">Log In</Link>
        )}
      </nav>
    </header>
  );
}

function FloatingAddButton() {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (location.pathname !== "/" || !currentUser) return null;

  return (
    <Link to="/create" className="floating-add-btn">
      <IoMdAdd size={35} />
    </Link>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          {/* Floating Add Button */}
          <FloatingAddButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
