import { exampleBookReq, exampleBookReq2 } from "@/app/__tests__/fixtures";
import { insertBook, insertBookTag, insertTag } from "@/app/__tests__/helpers";
import { describe, expect, it } from "vitest";
import * as tagRepo from './tag.repo';

describe('getTagsByBookId', async () => {
  it('returns tags for a book', async () => {
    const book = await insertBook(exampleBookReq);
    const tag = await insertTag('Fiction');
    await insertBookTag(book, tag);

    expect(await tagRepo.getTagsByBookId(book.id)).toEqual([tag]);
  });

  it('returns empty array when book has no tags', async () => {
    const book = await insertBook(exampleBookReq);
    expect(await tagRepo.getTagsByBookId(book.id)).toEqual([]);
  });
});

describe('getOrCreateTag', async () => {
  it('creates a new tag', async () => {
    const tag = await tagRepo.getOrCreateTag('Fiction');
    expect(tag.name).toEqual('Fiction');
    expect(tag.id).toBeDefined();
  });

  it('returns the existing tag when name already exists', async () => {
    const tag1 = await tagRepo.getOrCreateTag('Fiction');
    const tag2 = await tagRepo.getOrCreateTag('Fiction');
    expect(tag1.id).toEqual(tag2.id);
  });
});

describe('createBookTag', async () => {
  it('creates a book tag', async () => {
    const book = await insertBook(exampleBookReq);
    const tag = await insertTag('Fiction');
    await tagRepo.createBookTag({ bookId: book.id, tagId: tag.id });
    expect(await tagRepo.getTagsByBookId(book.id)).toContainEqual(tag);
  });

  it('does not throw when book tag already exists', async () => {
    const book = await insertBook(exampleBookReq);
    const tag = await insertTag('Fiction');
    await tagRepo.createBookTag({ bookId: book.id, tagId: tag.id });
    await expect(tagRepo.createBookTag({ bookId: book.id, tagId: tag.id })).resolves.not.toThrow();
  });
});

describe('deleteBookTag', async () => {
  it('removes a tag from a book', async () => {
    const book = await insertBook(exampleBookReq);
    const tag = await insertTag('Fiction');
    await insertBookTag(book, tag);
    await tagRepo.deleteBookTag({ bookId: book.id, tagId: tag.id });
    expect(await tagRepo.getTagsByBookId(book.id)).toEqual([]);
  });
});

describe('getAllTagsWithBookCount', async () => {
  it('returns tags ordered by book count descending', async () => {
    const book1 = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);
    const popular = await insertTag('Fiction');
    const lesserKnown = await insertTag('Travel');
    await insertBookTag(book1, popular);
    await insertBookTag(book2, popular);
    await insertBookTag(book1, lesserKnown);

    const result = await tagRepo.getAllTagsWithBookCount();
    expect(result[0]).toEqual({ ...popular, bookCount: 2 });
    expect(result[1]).toEqual({ ...lesserKnown, bookCount: 1 });
  });
});
