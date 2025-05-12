import { openDB, DBSchema } from 'idb';
import { BlogPost } from '../types/blog';

interface BlogDB extends DBSchema {
  posts: {
    key: string;
    value: BlogPost;
    indexes: {
      'by-date': string;
    };
  };
}

const dbPromise = openDB<BlogDB>('blog-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('posts', {
      keyPath: 'id',
    });
    store.createIndex('by-date', 'date');
  },
});

// Get all posts
export const getPosts = async (): Promise<BlogPost[]> => {
  const db = await dbPromise;
  const posts = await db.getAllFromIndex('posts', 'by-date');
  return posts.reverse(); // Most recent first
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const db = await dbPromise;
  const post = await db.get('posts', id);
  return post || undefined;
};

// Create a new post
export const createPost = async (post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
  const db = await dbPromise;
  const date = new Date().toISOString().split('T')[0];
  const tx = db.transaction('posts', 'readwrite');
  
  // Get the highest ID and increment by 1
  const posts = await tx.store.getAll();
  const maxId = posts.reduce((max, post) => Math.max(max, parseInt(post.id)), 0);
  const newId = (maxId + 1).toString();

  const newPost: BlogPost = {
    ...post,
    id: newId,
    date
  };

  await tx.store.add(newPost);
  await tx.done;

  return newPost;
};

// Update an existing post
export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  const db = await dbPromise;
  const tx = db.transaction('posts', 'readwrite');
  const post = await tx.store.get(id);

  if (!post) {
    await tx.done;
    return null;
  }

  const updatedPost = {
    ...post,
    ...updates
  };

  await tx.store.put(updatedPost);
  await tx.done;

  return updatedPost;
};

// Delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  const db = await dbPromise;
  const tx = db.transaction('posts', 'readwrite');
  const post = await tx.store.get(id);

  if (!post) {
    await tx.done;
    return false;
  }

  await tx.store.delete(id);
  await tx.done;
  return true;
};

// Initialize with sample post if the database is empty
const initializeSamplePost = async () => {
  const posts = await getPosts();
  if (posts.length === 0) {
    await createPost({
      title: 'Understanding the New World Order',
      summary: 'An analysis of the changing global power dynamics in the 21st century.',
      content: 'The international system is undergoing significant changes...',
      author: 'Dr. Sarah Johnson',
      imageUrl: 'https://source.unsplash.com/random/800x400?politics'
    });
  }
};

initializeSamplePost(); 