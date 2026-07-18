import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../repos/book.repo', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocationId: vi.fn(),
  createBook: vi.fn(),
  getBookById: vi.fn(),
  deleteBookById: vi.fn(),
  createBookLocation: vi.fn(),
  deleteBookLocation: vi.fn(),
  queryBooks: vi.fn(),
  updateBookDescription: vi.fn(),
  getBooksWithoutTags: vi.fn(),
}));
vi.mock('./location.service', () => ({
  getLocationByCode: vi.fn()
}));
vi.mock('../storage/cover', () => ({
  uploadCover: vi.fn(),
  deleteCover: vi.fn(),
}));
import * as bookService from '../services/book.service';
import { exampleBook, exampleBookAPIReq, exampleBookReq, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocationId, createBook, getBookById, deleteBookById, createBookLocation, deleteBookLocation, queryBooks, updateBookDescription, getBooksWithoutTags } from "../repos/book.repo";
import * as BookRepo from "../repos/book.repo";
import { getLocationByCode } from "./location.service";
import * as LocationService from "./location.service";
import { uploadCover, deleteCover } from "../storage/cover";
import * as CoverStorage from "../storage/cover";

const mockedRepoGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookRepo.getRandomBookByLocation
  >;

const mockedRepoGetBooksByLocationId =
  getBooksByLocationId as MockedFunction<
    typeof BookRepo.getBooksByLocationId
  >;

const mockedRepoCreateBook =
  createBook as MockedFunction<
    typeof BookRepo.createBook
  >;

const mockedRepoGetBookById =
  getBookById as MockedFunction<
    typeof BookRepo.getBookById
  >;

const mockedRepoDeleteBookById =
  deleteBookById as MockedFunction<
    typeof BookRepo.deleteBookById
  >;

const mockedRepoCreateBookLocation =
  createBookLocation as MockedFunction<
    typeof BookRepo.createBookLocation
  >;

const mockedRepoDeleteBookLocation =
  deleteBookLocation as MockedFunction<
    typeof BookRepo.deleteBookLocation
  >;

const mockedLocationServiceGetLocationByCode =
  getLocationByCode as MockedFunction<
    typeof LocationService.getLocationByCode
  >;

const mockedRepoQueryBooks =
  queryBooks as MockedFunction<
    typeof BookRepo.queryBooks
  >;

const mockedRepoUpdateBookDescription =
  updateBookDescription as MockedFunction<
    typeof BookRepo.updateBookDescription
  >;

const mockedRepoGetBooksWithoutTags =
  getBooksWithoutTags as MockedFunction<
    typeof BookRepo.getBooksWithoutTags
  >;

const mockedUploadCover =
  uploadCover as MockedFunction<
    typeof CoverStorage.uploadCover
  >;

const mockedDeleteCover =
  deleteCover as MockedFunction<
    typeof CoverStorage.deleteCover
  >;

describe('getRandomBookByLocation', async () => {
  it('gets random book from service', async () => {
    mockedRepoGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookService.getRandomBookByLocationCode(exampleCountry.code)).toEqual(exampleBook);
    expect(mockedLocationServiceGetLocationByCode).toHaveBeenCalledWith(exampleCountry.code);
  });
});

describe('getBooksByLocationId', async () => {
  it('gets all books for location', async () => {
    const books = [exampleBook];
    mockedRepoGetBooksByLocationId.mockResolvedValue(books);
    expect(await bookService.getBooksByLocationId(exampleCountry.id)).toEqual(books);
  });
});

describe('createBook', async () => {
  it('uploads the cover and creates a book with book repo', async () => {
    mockedRepoCreateBook.mockResolvedValue(exampleBook);
    expect(await bookService.createBook(exampleBookAPIReq)).toEqual(exampleBook);
    expect(mockedUploadCover).toHaveBeenCalledWith(exampleBookAPIReq.cover, expect.any(String));
    expect(mockedRepoCreateBook).toHaveBeenCalledWith(
      expect.any(String),
      { title: exampleBookReq.title, author: exampleBookReq.author, description: exampleBookReq.description }
    );
  });
});

describe('getBookById', async () => {
  it('gets book by ID from book repo', async () => {
    mockedRepoGetBookById.mockResolvedValue(exampleBook);
    expect(await bookService.getBookById(exampleBook.id)).toEqual(exampleBook);
  });
});

describe('deleteBookById', async () => {
  it('deletes the cover and the book', async () => {
    await bookService.deleteBookById(exampleBook.id);
    expect(mockedDeleteCover).toHaveBeenCalledWith(exampleBook.id);
    expect(mockedRepoDeleteBookById).toHaveBeenCalledWith(exampleBook.id);
  });
});

describe('updateBookDescription', async () => {
  it('updates book description with book repo', async () => {
    const description = 'A new description';
    const updatedBook = { ...exampleBook, description };
    mockedRepoUpdateBookDescription.mockResolvedValue(updatedBook);
    expect(await bookService.updateBookDescription(exampleBook.id, description)).toEqual(updatedBook);
    expect(mockedRepoUpdateBookDescription).toHaveBeenCalledWith(exampleBook.id, description);
  });
});

describe('createBookLocation', async () => {
  it('creates a book location with the book repo', async () => {
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    await bookService.createBookLocation(bookLocation);
    expect(mockedRepoCreateBookLocation).toHaveBeenCalledWith(bookLocation);
  });
});

describe('deleteBookLocation', async () => {
  it('deletes a book location with the book repo', async () => {
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    await bookService.deleteBookLocation(bookLocation);
    expect(mockedRepoDeleteBookLocation).toHaveBeenCalledWith(bookLocation);
  });
});

describe('queryBooks', async () => {
  it('queries books from the book repo', async () => {
    const books = [exampleBook];
    mockedRepoQueryBooks.mockResolvedValue(books);
    const query = "query";
    expect(await bookService.queryBooks(query)).toEqual(books);
  });
});

describe('getBooksWithoutTags', async () => {
  it('gets books without tags from the book repo', async () => {
    const books = [exampleBook];
    mockedRepoGetBooksWithoutTags.mockResolvedValue(books);
    expect(await bookService.getBooksWithoutTags()).toEqual(books);
  });
});
