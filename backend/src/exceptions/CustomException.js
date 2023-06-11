export class CustomException extends Error {
  #code;

  constructor(message, code = 400) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
  }
}
