import { BlogPost } from '../types/blog';
import * as db from './database';

export const getPosts = async (): Promise<BlogPost[]> => {
  return db.getPosts();
};

export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  return db.getPostById(id);
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
  return db.createPost(post);
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  return db.updatePost(id, updates);
};

export const deletePost = async (id: string): Promise<boolean> => {
  return db.deletePost(id);
}; 