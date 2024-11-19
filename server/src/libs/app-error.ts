export class AppError extends Error {
  public readonly status: number;
  public readonly details?: string | string[];

  constructor(message: string, status: number = 500, details?: string | string[]) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.status = status;
    this.details = details;
    this.name = "AppError";
  }

  toString() {
    return this.message;
  }
}
