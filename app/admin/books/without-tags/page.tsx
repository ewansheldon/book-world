export const dynamic = 'force-dynamic';

import { getBooksWithoutTags } from '@/app/api/books/book.controller';
import Link from 'next/link';

const BooksWithoutTagsPage = async () => {
  const books = await getBooksWithoutTags();

  return (
    <div className="admin-section">
      <h1>Books without tags</h1>
      {books.length === 0 ? (
        <p>All books have tags.</p>
      ) : (
        <div className="admin-results">
          {books.map(book => (
            <Link key={book.id} className="admin-result-item" href={`/admin/books/${book.id}`}>
              <span>{book.title}</span>
              <span style={{ color: '#888', fontSize: '13px' }}> — {book.author}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksWithoutTagsPage;
