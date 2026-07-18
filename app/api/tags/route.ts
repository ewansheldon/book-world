import { NextRequest, NextResponse } from 'next/server';
import * as tagController from './tag.controller';

export const GET = async (_req: NextRequest) => {
  return NextResponse.json(await tagController.getAllTagsWithBookCount());
};
