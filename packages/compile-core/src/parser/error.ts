export class ParserError extends Error {
  index: number = 0;
  constructor(index: number, ...rest: Parameters<ErrorConstructor>) {
    super(...rest);
    this.index = index;
  }
}
