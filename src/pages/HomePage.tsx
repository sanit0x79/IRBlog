import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import * as postsService from '../services/posts';

const HomePage: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        const posts = await postsService.getPosts();
        setRecentPosts(posts.slice(0, 3)); // Get only the 3 most recent posts
      } catch (err) {
        setError('Failed to load recent posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to States of Mind
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Personal Essays on Power, Identity, and International Order
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    By {post.author} on {new Date(post.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {post.summary}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
            {recentPosts.length === 0 && (
              <p className="text-gray-600 text-center col-span-3 py-8">
                No posts available yet.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="text-center">
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View All Articles
        </Link>
      </section>
    </div>
  );
};

export default HomePage; 