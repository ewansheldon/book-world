import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../lib/services/tag.service', () => ({
  getTagsByBookId: vi.fn(),
  addTagToBook: vi.fn(),
  removeTagFromBook: vi.fn(),
  getAllTagsWithBookCount: vi.fn(),
}));
import * as tagController from './tag.controller';
import { exampleBook, exampleTag } from "@/app/__tests__/fixtures";
import { getTagsByBookId, addTagToBook, removeTagFromBook, getAllTagsWithBookCount } from '../../lib/services/tag.service';
import * as TagService from '../../lib/services/tag.service';

const mockedServiceGetTagsByBookId =
  getTagsByBookId as MockedFunction<typeof TagService.getTagsByBookId>;

const mockedServiceAddTagToBook =
  addTagToBook as MockedFunction<typeof TagService.addTagToBook>;

const mockedServiceRemoveTagFromBook =
  removeTagFromBook as MockedFunction<typeof TagService.removeTagFromBook>;

const mockedServiceGetAllTagsWithBookCount =
  getAllTagsWithBookCount as MockedFunction<typeof TagService.getAllTagsWithBookCount>;

describe('getTagsByBookId', async () => {
  it('gets tags for a book from the service', async () => {
    mockedServiceGetTagsByBookId.mockResolvedValue([exampleTag]);
    expect(await tagController.getTagsByBookId(exampleBook.id)).toEqual([exampleTag]);
    expect(mockedServiceGetTagsByBookId).toHaveBeenCalledWith(exampleBook.id);
  });
});

describe('addTagToBook', async () => {
  it('adds a tag to a book with the service', async () => {
    mockedServiceAddTagToBook.mockResolvedValue(exampleTag);
    expect(await tagController.addTagToBook(exampleBook.id, exampleTag.name)).toEqual(exampleTag);
    expect(mockedServiceAddTagToBook).toHaveBeenCalledWith(exampleBook.id, exampleTag.name);
  });
});

describe('removeTagFromBook', async () => {
  it('removes a tag from a book with the service', async () => {
    const bookTag = { bookId: exampleBook.id, tagId: exampleTag.id };
    await tagController.removeTagFromBook(bookTag);
    expect(mockedServiceRemoveTagFromBook).toHaveBeenCalledWith(bookTag);
  });
});

describe('getAllTagsWithBookCount', async () => {
  it('gets all tags with book counts from the service', async () => {
    const tagsWithCount = [{ ...exampleTag, bookCount: 3 }];
    mockedServiceGetAllTagsWithBookCount.mockResolvedValue(tagsWithCount);
    expect(await tagController.getAllTagsWithBookCount()).toEqual(tagsWithCount);
  });
});
