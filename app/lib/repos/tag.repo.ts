import { getDb } from '@/app/lib/db';
import { BookTag, Tag, TagWithCount } from '@/app/lib/types';
import { TagNotFoundError } from '../errors/tag.errors';

type TagDBRow = {
  id: string;
  name: string;
};

type TagWithCountDBRow = TagDBRow & { book_count: string };

const toTag = (row: TagDBRow): Tag => ({
  id: row.id,
  name: row.name,
});

const toTagWithCount = (row: TagWithCountDBRow): TagWithCount => ({
  id: row.id,
  name: row.name,
  bookCount: parseInt(row.book_count, 10),
});

export const getTagsByBookId = async (bookId: string): Promise<Tag[]> => {
  const result = await getDb().query(
    `
    SELECT t.id, t.name
    FROM tags t
    JOIN book_tags bt ON bt.tag_id = t.id
    WHERE bt.book_id = $1
    ORDER BY t.name;
    `, [bookId]
  );
  return result.rows.map(toTag);
};

export const getOrCreateTag = async (name: string): Promise<Tag> => {
  const result = await getDb().query(
    `
    INSERT INTO tags (id, name)
    VALUES (gen_random_uuid(), $1)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING *;
    `, [name]
  );
  return toTag(result.rows[0]);
};

export const createBookTag = async (bookTag: BookTag): Promise<void> => {
  await getDb().query(
    `
    INSERT INTO book_tags (book_id, tag_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
    `, [bookTag.bookId, bookTag.tagId]
  );
};

export const deleteBookTag = async (bookTag: BookTag): Promise<void> => {
  await getDb().query(
    `
    DELETE FROM book_tags
    WHERE book_id = $1 AND tag_id = $2;
    `, [bookTag.bookId, bookTag.tagId]
  );
};

export const getTagById = async (tagId: string): Promise<Tag> => {
  const result = await getDb().query(
    `SELECT id, name FROM tags WHERE id = $1 LIMIT 1;`,
    [tagId]
  );
  if (result.rows.length === 0) throw new TagNotFoundError();
  return toTag(result.rows[0]);
};

export const getAllTagsWithBookCount = async (): Promise<TagWithCount[]> => {
  const result = await getDb().query(
    `
    SELECT t.id, t.name, COUNT(bt.book_id) AS book_count
    FROM tags t
    LEFT JOIN book_tags bt ON bt.tag_id = t.id
    GROUP BY t.id, t.name
    ORDER BY COUNT(bt.book_id) DESC, t.name;
    `
  );
  return result.rows.map(toTagWithCount);
};
