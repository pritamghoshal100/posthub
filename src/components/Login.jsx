import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="create-post">
      <h2>Log In</h2>
      {error && <div className="error">{error}</div>}
      <div className="form-actions" style={{ justifyContent: 'center' }}>
        <button disabled={loading} className="submit-btn" onClick={handleGoogleSignIn}>
          {loading ? 'Logging In...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;