import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../repos/tag.repo', () => ({
  getTagsByBookId: vi.fn(),
  getOrCreateTag: vi.fn(),
  createBookTag: vi.fn(),
  deleteBookTag: vi.fn(),
  getAllTagsWithBookCount: vi.fn(),
}));
import * as tagService from './tag.service';
import { exampleBook, exampleTag } from "@/app/__tests__/fixtures";
import { getTagsByBookId, getOrCreateTag, createBookTag, deleteBookTag, getAllTagsWithBookCount } from '../repos/tag.repo';
import * as TagRepo from '../repos/tag.repo';

const mockedRepoGetTagsByBookId =
  getTagsByBookId as MockedFunction<typeof TagRepo.getTagsByBookId>;

const mockedRepoGetOrCreateTag =
  getOrCreateTag as MockedFunction<typeof TagRepo.getOrCreateTag>;

const mockedRepoCreateBookTag =
  createBookTag as MockedFunction<typeof TagRepo.createBookTag>;

const mockedRepoDeleteBookTag =
  deleteBookTag as MockedFunction<typeof TagRepo.deleteBookTag>;

const mockedRepoGetAllTagsWithBookCount =
  getAllTagsWithBookCount as MockedFunction<typeof TagRepo.getAllTagsWithBookCount>;

describe('getTagsByBookId', async () => {
  it('gets tags for a book from the repo', async () => {
    mockedRepoGetTagsByBookId.mockResolvedValue([exampleTag]);
    expect(await tagService.getTagsByBookId(exampleBook.id)).toEqual([exampleTag]);
    expect(mockedRepoGetTagsByBookId).toHaveBeenCalledWith(exampleBook.id);
  });
});

describe('addTagToBook', async () => {
  it('gets or creates the tag then creates the book tag', async () => {
    mockedRepoGetOrCreateTag.mockResolvedValue(exampleTag);
    const result = await tagService.addTagToBook(exampleBook.id, exampleTag.name);
    expect(mockedRepoGetOrCreateTag).toHaveBeenCalledWith(exampleTag.name);
    expect(mockedRepoCreateBookTag).toHaveBeenCalledWith({ bookId: exampleBook.id, tagId: exampleTag.id });
    expect(result).toEqual(exampleTag);
  });

  it('normalizes tag name to trimmed lowercase before creating', async () => {
    mockedRepoGetOrCreateTag.mockResolvedValue(exampleTag);
    await tagService.addTagToBook(exampleBook.id, '  Fiction  ');
    expect(mockedRepoGetOrCreateTag).toHaveBeenCalledWith('fiction');
  });
});

describe('removeTagFromBook', async () => {
  it('deletes the book tag with the repo', async () => {
    const bookTag = { bookId: exampleBook.id, tagId: exampleTag.id };
    await tagService.removeTagFromBook(bookTag);
    expect(mockedRepoDeleteBookTag).toHaveBeenCalledWith(bookTag);
  });
});

describe('getAllTagsWithBookCount', async () => {
  it('gets all tags with book counts from the repo', async () => {
    const tagsWithCount = [{ ...exampleTag, bookCount: 3 }];
    mockedRepoGetAllTagsWithBookCount.mockResolvedValue(tagsWithCount);
    expect(await tagService.getAllTagsWithBookCount()).toEqual(tagsWithCount);
  });
});
