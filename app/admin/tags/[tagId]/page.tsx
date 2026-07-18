export const dynamic = 'force-dynamic';

import { getBooksByTagId } from '@/app/api/books/book.controller';
import { getTagById } from '@/app/api/tags/tag.controller';
import Link from 'next/link';

type TagPageProps = {
  params: Promise<{ tagId: string }>;
};

const TagPage = async ({ params }: TagPageProps) => {
  const { tagId } = await params;
  const [tag, books] = await Promise.all([
    getTagById(tagId),
    getBooksByTagId(tagId),
  ]);

  return (
    <div className="admin-section">
      <h1>{tag.name}</h1>
      {books.length === 0 ? (
        <p>No books with this tag.</p>
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

export default TagPage;
