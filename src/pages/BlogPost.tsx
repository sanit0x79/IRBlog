import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import * as postsService from '../services/posts';
import { BlogPost as BlogPostType } from '../types/blog';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        navigate('/404');
        return;
      }

      try {
        const data = await postsService.getPostById(id);
        if (!data) {
          navigate('/404');
          return;
        }
        setPost(data);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error('Error loading post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
      />
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600">
          <span className="text-sm">By {post.author}</span>
          <span className="mx-2">•</span>
          <time className="text-sm">{new Date(post.date).toLocaleDateString()}</time>
        </div>
      </header>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      <div className="mt-12 pt-8 border-t border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Articles
        </button>
      </div>
    </article>
  );
};

export default BlogPost; 