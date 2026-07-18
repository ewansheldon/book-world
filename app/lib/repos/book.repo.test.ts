import { exampleBookReq, exampleBookReq2, exampleCountryReq, exampleCountryReq2, exampleStateReq } from "@/app/__tests__/fixtures";
import { insertBook, insertBookLocation, insertBookTag, insertLocation, insertTag } from "@/app/__tests__/helpers";
import { describe, expect, it } from "vitest";
import * as bookRepo from './book.repo';
import { BookNotFoundError } from "../errors/book.errors";

describe('getRandomBookByLocation', async () => {
  it('gets a random book for the location', async () => {
    const book1 = await insertBook(exampleBookReq);
    const country1 = await insertLocation(exampleCountryReq, null);
    await insertBookLocation(book1, country1);

    const book2 = await insertBook(exampleBookReq2);
    const country2 = await insertLocation(exampleCountryReq2, null);
    await insertBookLocation(book2, country2);

    expect(await bookRepo.getRandomBookByLocation(country1)).toEqual(book1);

    expect(await bookRepo.getRandomBookByLocation(country2)).toEqual(book2);
  });

  it('throws an error when no book', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    await expect(bookRepo.getRandomBookByLocation(country)).rejects.toBeInstanceOf(BookNotFoundError);
  });
});

describe('getBooksByLocationId', async () => {
  it('gets all books for location from database', async () => {
    const book1 = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    await insertBookLocation(book1, country);
    await insertBookLocation(book2, country);

    expect(await bookRepo.getBooksByLocationId(country.id)).toContainEqual(book1);
    expect(await bookRepo.getBooksByLocationId(country.id)).toContainEqual(book2);
    expect(await bookRepo.getBooksByLocationId(state.id)).to.be.empty;
  });
});

describe('createBook', async () => {
  it('creates a book in the database', async () => {
    const id = crypto.randomUUID();
    const createdBook = await bookRepo.createBook(id, exampleBookReq);

    expect(createdBook.id).toEqual(id);
    expect(createdBook.title).toEqual(exampleBookReq.title);
    expect(createdBook.author).toEqual(exampleBookReq.author);
    expect(createdBook.description).toEqual(exampleBookReq.description);
  });

  it('creates a book with a description', async () => {
    const id = crypto.randomUUID();
    const reqWithDescription = { ...exampleBookReq, description: 'A road trip novel' };
    const createdBook = await bookRepo.createBook(id, reqWithDescription);

    expect(createdBook.description).toEqual('A road trip novel');
  });
});

describe('getBookById', async () => {
  it('gets a book from the database by ID', async () => {
    const book = await insertBook(exampleBookReq);
    expect(await bookRepo.getBookById(book.id)).toEqual(book);
  });
});

describe('updateBookDescription', async () => {
  it('updates the description of a book', async () => {
    const id = crypto.randomUUID();
    const book = await bookRepo.createBook(id, exampleBookReq);
    const updated = await bookRepo.updateBookDescription(book.id, 'An updated description');
    expect(updated.description).toEqual('An updated description');
  });
});

describe('deleteBookById', async () => {
  it('deletes the book from the database', async () => {
    const book = await insertBook(exampleBookReq);
    await bookRepo.deleteBookById(book.id);
    await expect(bookRepo.getBookById(book.id)).rejects.toBeInstanceOf(BookNotFoundError);
  });
});

describe('createBookLocation', async () => {
  it('creates the book location in the database', async () => {
    const book = await insertBook(exampleBookReq);
    const location = await insertLocation(exampleCountryReq, null);
    await bookRepo.createBookLocation({ bookId: book.id, locationId: location.id });

    expect(await bookRepo.getBooksByLocationId(location.id)).toEqual([ book ]);
  });
});

describe('deleteBookLocation', async () => {
  it('deletes the book location from the database', async () => {
    const book = await insertBook(exampleBookReq);
    const location = await insertLocation(exampleCountryReq, null);
    await insertBookLocation(book, location);

    await bookRepo.deleteBookLocation({ bookId: book.id, locationId: location.id });

    expect(await bookRepo.getBooksByLocationId(location.id)).toEqual([]);
  });
});

describe('getBooksWithoutTags', async () => {
  it('returns only books with no tags', async () => {
    const tagged = await insertBook(exampleBookReq);
    const untagged = await insertBook(exampleBookReq2);
    const tag = await insertTag('Fiction');
    await insertBookTag(tagged, tag);

    const result = await bookRepo.getBooksWithoutTags();
    expect(result).toContainEqual(untagged);
    expect(result).not.toContainEqual(tagged);
  });

  it('returns all books when none have tags', async () => {
    const book1 = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);

    const result = await bookRepo.getBooksWithoutTags();
    expect(result).toContainEqual(book1);
    expect(result).toContainEqual(book2);
  });
});
