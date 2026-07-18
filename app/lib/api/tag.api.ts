import { apiDelete, apiFetch } from './api';
import { Tag, TagWithCount } from '../types';

export const getTagsByBookId = async (bookId: string): Promise<Tag[]> => {
  return apiFetch<Tag[]>(`/api/books/${bookId}/tags`);
};

export const addTagToBook = async (bookId: string, name: string): Promise<Tag> => {
  const formData = new FormData();
  formData.append('name', name);
  return apiFetch<Tag>(`/api/books/${bookId}/tags`, { method: 'POST', body: formData });
};

export const deleteBookTag = async (bookId: string, tagId: string): Promise<void> => {
  await apiDelete(`/api/books/${bookId}/tags/${tagId}`);
};

export const getAllTags = async (): Promise<TagWithCount[]> => {
  return apiFetch<TagWithCount[]>('/api/tags');
};
