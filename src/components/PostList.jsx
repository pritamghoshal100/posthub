import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postAPI.deletePost(id);
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        alert('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available. {currentUser && <Link to="/create">Create your first post!</Link>}</p>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <article key={post._id} className="post-card">
              {/* ... (post image and content) */}
              
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="post-image"
                />
              )}
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-excerpt">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="post-meta">
                  <span>By {post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              
              <div className="post-actions">
                <Link to={`/post/${post._id}`} className="read-more">Read More</Link>
                {currentUser && currentUser.uid === post.userId && (
                  <>
                    <Link to={`/edit/${post._id}`} className="edit-btn">Edit</Link>
                    <button 
                      onClick={() => handleDelete(post._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;