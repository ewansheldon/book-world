import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./tag.controller', () => ({
  getAllTagsWithBookCount: vi.fn(),
}));
import { exampleTag } from "@/app/__tests__/fixtures";
import { getAllTagsWithBookCount } from './tag.controller';
import type * as TagController from './tag.controller';
import { GET } from "./route";
import { NextRequest } from "next/server";

const mockedTagControllerGetAllTagsWithBookCount =
  getAllTagsWithBookCount as MockedFunction<
    typeof TagController.getAllTagsWithBookCount
  >;

describe('GET /api/tags', async () => {
  it('returns all tags with book counts from the controller', async () => {
    const tagsWithCount = [{ ...exampleTag, bookCount: 3 }];
    mockedTagControllerGetAllTagsWithBookCount.mockResolvedValue(tagsWithCount);
    const req = new NextRequest('http://localhost/api/tags');
    const res = await GET(req);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual(tagsWithCount);
  });
});
