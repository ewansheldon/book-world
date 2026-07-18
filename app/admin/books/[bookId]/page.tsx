import { getBookById } from "@/app/api/books/book.controller";
import { getLocations, getLocationsByBookId } from "@/app/api/locations/location.controller";
import { getTagsByBookId } from "@/app/api/tags/tag.controller";
import BookInfo from "./components/BookInfo";
import BookDescription from "./components/BookDescription";
import BookLocations from "./components/BookLocations";
import CreateBookLocation from "./components/CreateBookLocation";
import BookTags from "./components/BookTags";
import AddBookTag from "./components/AddBookTag";

type BookPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

const BookPage = async ({ params }: BookPageProps) => {
  const { bookId } = await params;
  const book = await getBookById(bookId);
  const bookLocations = await getLocationsByBookId(book.id);
  const allLocations = await getLocations(null);
  const bookTags = await getTagsByBookId(book.id);

  return (
    <>
      <BookInfo book={book} />
      <BookDescription bookId={book.id} initialDescription={book.description} />
      <BookLocations bookId={book.id} locations={bookLocations} />
      <CreateBookLocation book={book} locations={allLocations} />
      <BookTags bookId={book.id} tags={bookTags} />
      <AddBookTag bookId={book.id} existingTagIds={bookTags.map(t => t.id)} />
    </>
  );
};

export default BookPage;
