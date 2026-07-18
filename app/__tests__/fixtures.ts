import { Book, BookAPIRequest, BookRequest, Location, LocationRequest, Tag } from "../lib/types";

export const exampleBookReq: BookRequest = {
  author: 'Jack Kerouac',
  title: 'Big Sur',
  description: 'A semi-autobiographical novel set on the California coast.',
}

export const exampleBookAPIReq: BookAPIRequest = {
  author: exampleBookReq.author,
  title: exampleBookReq.title,
  description: exampleBookReq.description,
  cover: new File(
    ['image bytes'],
    'cover.jpg',
    { type: 'image/jpeg' }
  )
}

export const exampleBook: Book = {
  id: "example-uuid-1",
  ... exampleBookReq
}

export const exampleBookReq2: BookRequest = {
  author: 'Ernest Hemingway',
  title: 'The Sun Also Rises',
  description: 'A story of American and British expatriates in 1920s Europe.',
}

export const exampleCountryReq: LocationRequest = {
  level: 'country',
  code: 'US',
  name: 'United States of America',
  parentId: null
}

export const exampleCountryReq2: LocationRequest = {
  level: 'country',
  code: 'ES',
  name: 'Spain',
  parentId: null
}

export const exampleCountry: Location = {
  id: "example-uuid-2",
  ... exampleCountryReq
}

export const exampleStateReq: LocationRequest = {
  level: 'state',
  code: 'US-CA',
  name: 'California',
  parentId: null
}

export const exampleState: Location = {
  id: "example-uuid-3",
  ... exampleStateReq
}

export const exampleTag: Tag = {
  id: "example-uuid-4",
  name: "fiction",
}
