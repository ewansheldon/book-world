import { BookTag, Tag, TagWithCount } from '@/app/lib/types';
import * as tagRepo from '../repos/tag.repo';

export const getTagsByBookId = async (bookId: string): Promise<Tag[]> => {
  return tagRepo.getTagsByBookId(bookId);
};

export const addTagToBook = async (bookId: string, tagName: string): Promise<Tag> => {
  const tag = await tagRepo.getOrCreateTag(tagName);
  await tagRepo.createBookTag({ bookId, tagId: tag.id });
  return tag;
};

export const removeTagFromBook = async (bookTag: BookTag): Promise<void> => {
  await tagRepo.deleteBookTag(bookTag);
};

export const getAllTagsWithBookCount = async (): Promise<TagWithCount[]> => {
  return tagRepo.getAllTagsWithBookCount();
};
