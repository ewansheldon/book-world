type UUIDPrimaryKey = { id: string; }

export type BookRequest = {
  title: string;
  author: string;
  description?: string;
}

export type BookAPIRequest = {
  title: string;
  author: string;
  description?: string;
  cover: File;
}

export type Book = BookRequest & UUIDPrimaryKey

export type LocationLevel = 'country' | 'state' | 'region';

export type LocationRequest = {
  level: LocationLevel;
  code: string;
  name: string;
  parentId: string | null;
}

export type Location = LocationRequest & UUIDPrimaryKey

type BookParams = {
  bookId: string;
};

export type PromisedBookParams = {
  params: Promise<BookParams>;
};

type LocationParams = {
  locationId: string;
};

export type PromisedLocationParams = {
  params: Promise<LocationParams>;
};

type BookLocationParams = {
  bookId: string;
  locationId: string;
};

export type PromisedBookLocationParams = {
  params: Promise<BookLocationParams>;
};

export type BookLocation = {
  bookId: string;
  locationId: string;
}

export type Tag = {
  id: string;
  name: string;
}

export type TagWithCount = Tag & {
  bookCount: number;
}

export type BookTag = {
  bookId: string;
  tagId: string;
}

type BookTagParams = {
  bookId: string;
  tagId: string;
};

export type PromisedBookTagParams = {
  params: Promise<BookTagParams>;
};