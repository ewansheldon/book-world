import { PromisedBookTagParams } from '@/app/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import * as tagController from '@/app/api/tags/tag.controller';

export const DELETE = async (_req: NextRequest, { params }: PromisedBookTagParams) => {
  const { bookId, tagId } = await params;
  await tagController.removeTagFromBook({ bookId, tagId });
  return new NextResponse(null, { status: 204 });
};
