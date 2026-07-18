export class TagNotFoundError extends Error {
  constructor(message = 'No tag found') {
    super(message);
    this.name = 'TagNotFoundError';
  }
}
