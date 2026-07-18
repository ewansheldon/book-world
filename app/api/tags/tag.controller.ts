import { BookTag, Tag, TagWithCount } from '@/app/lib/types';
import * as tagService from '../../lib/services/tag.service';

export const getTagsByBookId = async (bookId: string): Promise<Tag[]> => {
  return tagService.getTagsByBookId(bookId);
};

export const addTagToBook = async (bookId: string, tagName: string): Promise<Tag> => {
  return tagService.addTagToBook(bookId, tagName);
};

export const removeTagFromBook = async (bookTag: BookTag): Promise<void> => {
  await tagService.removeTagFromBook(bookTag);
};

export const getAllTagsWithBookCount = async (): Promise<TagWithCount[]> => {
  return tagService.getAllTagsWithBookCount();
};
