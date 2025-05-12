import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import * as postsService from '../services/posts';
import { useAuth } from '../context/AuthContext';
import MarkdownEditor from '../components/MarkdownEditor';

interface FormData {
  title: string;
  summary: string;
  content: string;
  author: string;
  imageUrl: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    content: '',
    author: '',
    imageUrl: '',
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postsService.getPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (formData.imageUrl) {
      setPreviewImage(formData.imageUrl);
    }
  }, [formData.imageUrl]);

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      author: '',
      imageUrl: '',
    });
    setPreviewImage('');
    setEditingPost(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      summary: post.summary,
      content: post.content,
      author: post.author,
      imageUrl: post.imageUrl || '',
    });
    setPreviewImage(post.imageUrl || '');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsService.deletePost(id);
        const updatedPosts = await postsService.getPosts();
        setPosts(updatedPosts);
      } catch (err) {
        setError('Failed to delete post. Please try again later.');
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const postData = {
        ...formData,
        imageUrl: formData.imageUrl || undefined,
      };

      if (editingPost) {
        await postsService.updatePost(editingPost.id, postData);
      } else {
        await postsService.createPost(postData);
      }

      const updatedPosts = await postsService.getPosts();
      setPosts(updatedPosts);
      resetForm();
    } catch (err) {
      setError('Failed to save post. Please try again later.');
      console.error('Error saving post:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mb-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <input
                type="text"
                id="summary"
                name="summary"
                required
                value={formData.summary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <MarkdownEditor
                content={formData.content}
                onChange={handleEditorChange}
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://source.unsplash.com/random/800x400?your-topic"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              {editingPost && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Posts</h2>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        By {post.author} on {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-600 text-center py-4">No posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 