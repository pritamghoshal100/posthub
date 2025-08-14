import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError('Failed to create an account.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="create-post">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button disabled={loading} className="submit-btn" type="submit">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default SignUp;