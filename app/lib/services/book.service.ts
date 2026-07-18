import { Book, BookAPIRequest, BookLocation } from "@/app/lib/types";
import * as bookRepo from '../repos/book.repo';
import * as locationService from './location.service';
import { uploadCover, deleteCover } from '../storage/cover';

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  const location = await locationService.getLocationByCode(locationCode);
  return bookRepo.getRandomBookByLocation(location);
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return bookRepo.getBooksByLocationId(locationId);
}

export const createBook = async ({ title, author, description, cover }: BookAPIRequest): Promise<Book> => {
  const id = crypto.randomUUID();
  await uploadCover(cover, id);
  return bookRepo.createBook(id, { title, author, description });
}

export const updateBookDescription = async (id: string, description: string): Promise<Book> => {
  return bookRepo.updateBookDescription(id, description);
}

export const getBookById = async (id: string): Promise<Book> => {
  return await bookRepo.getBookById(id);
}

export const deleteBookById = async (id: string) => {
  await deleteCover(id);
  return await bookRepo.deleteBookById(id);
}

export const createBookLocation = async (bookLocation: BookLocation) => {
  await bookRepo.createBookLocation(bookLocation);
}

export const deleteBookLocation = async (bookLocation: BookLocation) => {
  await bookRepo.deleteBookLocation(bookLocation);
}

export const getBooksWithoutDescription = async (): Promise<Book[]> => {
  return bookRepo.getBooksWithoutDescription();
}

export const getBooksByTagId = async (tagId: string): Promise<Book[]> => {
  return bookRepo.getBooksByTagId(tagId);
}

export const getBooksWithoutTags = async (): Promise<Book[]> => {
  return bookRepo.getBooksWithoutTags();
}

export const queryBooks = async (query: string): Promise<Book[]> => {
  return bookRepo.queryBooks(query);
}
