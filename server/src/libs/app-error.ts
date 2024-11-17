export class AppError extends Error {
  public readonly status: number;
  public readonly details?: string | string[];

  constructor(message: string, status: number = 500, details?: string | string[]) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "AppError";
  }

  toString() {
    return this.message;
  }
}
