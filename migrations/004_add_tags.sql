CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE book_tags (
  book_id UUID NOT NULL,
  tag_id UUID NOT NULL,

  PRIMARY KEY (book_id, tag_id),

  CONSTRAINT fk_book
    FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags(id)
    ON DELETE CASCADE
);

CREATE INDEX ON book_tags(tag_id);
