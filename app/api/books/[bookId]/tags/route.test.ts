import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('@/app/api/tags/tag.controller', () => ({
  getTagsByBookId: vi.fn(),
  addTagToBook: vi.fn(),
}));
import { exampleBook, exampleTag } from "@/app/__tests__/fixtures";
import { getTagsByBookId, addTagToBook } from '@/app/api/tags/tag.controller';
import type * as TagController from '@/app/api/tags/tag.controller';
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

const mockedTagControllerGetTagsByBookId =
  getTagsByBookId as MockedFunction<typeof TagController.getTagsByBookId>;

const mockedTagControllerAddTagToBook =
  addTagToBook as MockedFunction<typeof TagController.addTagToBook>;

describe('GET /api/books/:bookId/tags', async () => {
  it('returns tags for the book from the controller', async () => {
    mockedTagControllerGetTagsByBookId.mockResolvedValue([exampleTag]);
    const req = new NextRequest(`http://localhost/api/books/${exampleBook.id}/tags`);
    const params = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const res = await GET(req, params);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([exampleTag]);
  });
});

describe('POST /api/books/:bookId/tags', async () => {
  it('adds a tag to the book and returns 201', async () => {
    mockedTagControllerAddTagToBook.mockResolvedValue(exampleTag);
    const formData = new FormData();
    formData.append('name', exampleTag.name);
    const req = new NextRequest(`http://localhost/api/books/${exampleBook.id}/tags`, {
      method: 'POST',
      body: formData,
    });
    const params = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const res = await POST(req, params);
    expect(res.status).toEqual(201);
    expect(await res.json()).toEqual(exampleTag);
    expect(mockedTagControllerAddTagToBook).toHaveBeenCalledWith(exampleBook.id, exampleTag.name);
  });

  it('returns 400 when tag name is missing', async () => {
    const formData = new FormData();
    const req = new NextRequest(`http://localhost/api/books/${exampleBook.id}/tags`, {
      method: 'POST',
      body: formData,
    });
    const params = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const res = await POST(req, params);
    expect(res.status).toEqual(400);
  });
});
