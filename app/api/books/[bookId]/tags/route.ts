import { PromisedBookParams } from '@/app/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import * as tagController from '@/app/api/tags/tag.controller';
import { InvalidParamsError } from '@/app/api/errors';

export const GET = async (_req: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  return NextResponse.json(await tagController.getTagsByBookId(bookId));
};

const validateTagName = (formData: FormData): string => {
  const name = formData.get('name');
  if (typeof name !== 'string' || name.trim() === '') throw new InvalidParamsError('Invalid tag name');
  return name.trim();
};

export const POST = async (request: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  let name: string;
  try {
    name = validateTagName(await request.formData());
  } catch (e) {
    return NextResponse.json({ message: e instanceof Error ? e.message : 'Invalid payload' }, { status: 400 });
  }
  const tag = await tagController.addTagToBook(bookId, name);
  return NextResponse.json(tag, { status: 201 });
};
