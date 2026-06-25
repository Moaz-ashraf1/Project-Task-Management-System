export class UnauthenticatedException extends Error {
  statusCode = 401;
  constructor(message = "Unauthenticated") {
    super(message);
    this.name = "UnauthenticatedException";
  }
}