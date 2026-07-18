import { describe, expect, it } from 'vitest';
import { exampleBookReq, exampleBookReq2 } from '@/app/__tests__/fixtures';
import { insertBook, insertBookTag, insertTag } from '@/app/__tests__/helpers';
import { NextRequest } from 'next/server';
import { GET as GET_TAGS } from './route';
import { GET as GET_BOOK_TAGS, POST as POST_BOOK_TAG } from '../books/[bookId]/tags/route';
import { DELETE as DELETE_BOOK_TAG } from '../books/[bookId]/tags/[tagId]/route';

describe('GET /api/books/:bookId/tags', async () => {
  it('returns tags for a book', async () => {
    const book = await insertBook(exampleBookReq);
    const tag = await insertTag('Fiction');
    await insertBookTag(book, tag);

    const req = new NextRequest(`http://localhost/api/books/${book.id}/tags`);
    const params = { params: Promise.resolve({ bookId: book.id }) };
    const res = await GET_BOOK_TAGS(req, params);

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([tag]);
  });

  it('returns empty array when book has no tags', async () => {
    const book = await insertBook(exampleBookReq);

    const req = new NextRequest(`http://localhost/api/books/${book.id}/tags`);
    const params = { params: Promise.resolve({ bookId: book.id }) };
    const res = await GET_BOOK_TAGS(req, params);

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([]);
  });
});

describe('POST /api/books/:bookId/tags', async () => {
  it('adds a new tag to a book', async () => {
    const book = await insertBook(exampleBookReq);

    const formData = new FormData();
    formData.append('name', 'Fiction');
    const req = new NextRequest(`http://localhost/api/books/${book.id}/tags`, {
      method: 'POST',
      body: formData,
    });
    const params = { params: Promise.resolve({ bookId: book.id }) };
    const postRes = await POST_BOOK_TAG(req, params);
    expect(postRes.status).toEqual(201);
    const tag = await postRes.json();
    expect(tag.name).toEqual('Fiction');
    expect(tag.id).toBeDefined();

    const getRes = await GET_BOOK_TAGS(
      new NextRequest(`http://localhost/api/books/${book.id}/tags`),
      params
    );
    expect(await getRes.json()).toEqual([tag]);
  });

  it('reuses an existing tag when the name already exists', async () => {
    const book1 = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);
    const existingTag = await insertTag('Fiction');
    await insertBookTag(book1, existingTag);

    const formData = new FormData();
    formData.append('name', 'Fiction');
    const req = new NextRequest(`http://localhost/api/books/${book2.id}/tags`, {
      method: 'POST',
      body: formData,
    });
    const res = await POST_BOOK_TAG(req, { params: Promise.resolve({ bookId: book2.id }) });
    expect(res.status).toEqual(201);
    const tag = await res.json();
    expect(tag.id).toEqual(existingTag.id);

    const tagsRes = await GET_TAGS(new NextRequest('http://localhost/api/tags'));
    const tags = await tagsRes.json();
    expect(tags.find((t: { id: string }) => t.id === existingTag.id).bookCount).toEqual(2);
  });

  it('returns 400 when tag name is missing', async () => {
    const book = await insertBook(exampleBookReq);
    const formData = new FormData();
    const req = new NextRequest(`http://localhost/api/books/${book.id}/tags`, {
      method: 'POST',
      body: formData,
    });
    const res = await POST_BOOK_TAG(req, { params: Promise.resolve({ bookId: book.id }) });
    expect(res.status).toEqual(400);
  });
});

describe('DELETE /api/books/:bookId/tags/:tagId', async () => {
  it('removes a tag from a book', async () => {
    const book = await insertBook(exampleBookReq);
    const tag = await insertTag('Fiction');
    await insertBookTag(book, tag);

    const deleteReq = new NextRequest(`http://localhost/api/books/${book.id}/tags/${tag.id}`, {
      method: 'DELETE',
    });
    const params = { params: Promise.resolve({ bookId: book.id, tagId: tag.id }) };
    const deleteRes = await DELETE_BOOK_TAG(deleteReq, params);
    expect(deleteRes.status).toEqual(204);

    const getRes = await GET_BOOK_TAGS(
      new NextRequest(`http://localhost/api/books/${book.id}/tags`),
      { params: Promise.resolve({ bookId: book.id }) }
    );
    expect(await getRes.json()).toEqual([]);
  });
});

describe('GET /api/tags', async () => {
  it('returns all tags ordered by book count descending', async () => {
    const book1 = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);
    const popular = await insertTag('Fiction');
    const lesserKnown = await insertTag('Travel');
    await insertBookTag(book1, popular);
    await insertBookTag(book2, popular);
    await insertBookTag(book1, lesserKnown);

    const req = new NextRequest('http://localhost/api/tags');
    const res = await GET_TAGS(req);
    expect(res.status).toEqual(200);
    const tags = await res.json();
    expect(tags[0]).toEqual({ ...popular, bookCount: 2 });
    expect(tags[1]).toEqual({ ...lesserKnown, bookCount: 1 });
  });
});
