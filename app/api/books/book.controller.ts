import { Book, BookAPIRequest } from "@/app/lib/types";
import * as bookService from "../../lib/services/book.service";

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  return await bookService.getRandomBookByLocationCode(locationCode);
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return await bookService.getBooksByLocationId(locationId);
}

export const createBook = async (bookAPIReq: BookAPIRequest): Promise<Book> => {
  return await bookService.createBook(bookAPIReq);
}

export const getBookById = async (id: string): Promise<Book> => {
  return await bookService.getBookById(id);
}

export const deleteBookById = async (id: string) => {
  return await bookService.deleteBookById(id);
}

export const updateBookDescription = async (id: string, description: string): Promise<Book> => {
  return await bookService.updateBookDescription(id, description);
}

export const createBookLocation = async (bookId: string, locationId: string) => {
  await bookService.createBookLocation({ bookId, locationId });
}

export const deleteBookLocation = async (bookId: string, locationId: string) => {
  await bookService.deleteBookLocation({ bookId, locationId });
}

export const getBooksWithoutDescription = async (): Promise<Book[]> => {
  return await bookService.getBooksWithoutDescription();
}

export const getBooksByTagId = async (tagId: string): Promise<Book[]> => {
  return await bookService.getBooksByTagId(tagId);
}

export const getBooksWithoutTags = async (): Promise<Book[]> => {
  return await bookService.getBooksWithoutTags();
}

export const queryBooks = async (query: string): Promise<Book[]> => {
  return await bookService.queryBooks(query);
}
