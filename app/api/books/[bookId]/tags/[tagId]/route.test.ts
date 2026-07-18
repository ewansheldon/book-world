import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('@/app/api/tags/tag.controller', () => ({
  removeTagFromBook: vi.fn(),
}));
import { exampleBook, exampleTag } from "@/app/__tests__/fixtures";
import { removeTagFromBook } from '@/app/api/tags/tag.controller';
import type * as TagController from '@/app/api/tags/tag.controller';
import { DELETE } from "./route";
import { NextRequest } from "next/server";

const mockedTagControllerRemoveTagFromBook =
  removeTagFromBook as MockedFunction<typeof TagController.removeTagFromBook>;

describe('DELETE /api/books/:bookId/tags/:tagId', async () => {
  it('removes the tag from the book and returns 204', async () => {
    const req = new NextRequest(`http://localhost/api/books/${exampleBook.id}/tags/${exampleTag.id}`);
    const params = { params: Promise.resolve({ bookId: exampleBook.id, tagId: exampleTag.id }) };
    const res = await DELETE(req, params);
    expect(res.status).toEqual(204);
    expect(mockedTagControllerRemoveTagFromBook).toHaveBeenCalledWith({
      bookId: exampleBook.id,
      tagId: exampleTag.id,
    });
  });
});
