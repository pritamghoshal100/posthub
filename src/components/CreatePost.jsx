import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postAPI } from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id, isEditing]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(id);
      const post = response.data;
      setFormData({
        title: post.title,
        content: post.content,
        tags: post.tags ? post.tags.join(', ') : ''
      });
      setCurrentImageUrl(post.imageUrl || '');
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    // Preview image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('tags', formData.tags);
    
    if (image) {
      submitData.append('image', image);
    }

    try {
      if (isEditing) {
        await postAPI.updatePost(id, submitData);
      } else {
        await postAPI.createPost(submitData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save post');
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            maxLength="200"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {currentImageUrl && (
            <div className="image-preview">
              <img src={currentImageUrl} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="react, nodejs, mongodb"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows="15"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;