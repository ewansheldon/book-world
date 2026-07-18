import { BookTag, Tag, TagWithCount } from '@/app/lib/types';
import * as tagRepo from '../repos/tag.repo';

export const getTagsByBookId = async (bookId: string): Promise<Tag[]> => {
  return tagRepo.getTagsByBookId(bookId);
};

export const addTagToBook = async (bookId: string, tagName: string): Promise<Tag> => {
  const tag = await tagRepo.getOrCreateTag(tagName.trim().toLowerCase());
  await tagRepo.createBookTag({ bookId, tagId: tag.id });
  return tag;
};

export const removeTagFromBook = async (bookTag: BookTag): Promise<void> => {
  await tagRepo.deleteBookTag(bookTag);
};

export const getTagById = async (tagId: string): Promise<Tag> => {
  return tagRepo.getTagById(tagId);
};

export const getAllTagsWithBookCount = async (): Promise<TagWithCount[]> => {
  return tagRepo.getAllTagsWithBookCount();
};
