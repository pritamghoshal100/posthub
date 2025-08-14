import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogPost = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postAPI.deletePost(id);
        navigate('/');
      } catch (err) {
        alert('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <article className="blog-post">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By <strong>{post.author}</strong></span>
          <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
          {post.updatedAt !== post.createdAt && (
            <span>Updated on {new Date(post.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {post.imageUrl && (
        <div className="post-featured-image">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      <div className="post-content">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="post-actions">
        <Link to="/" className="back-btn">← Back to Posts</Link>
        {currentUser && currentUser.uid === post.userId && (
          <div className="action-buttons">
            <Link to={`/edit/${post._id}`} className="edit-btn">Edit</Link>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;