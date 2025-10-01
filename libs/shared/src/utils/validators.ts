import { ValidationException } from "../exceptions/domain.exception";

export class Validators {
  static isNotEmpty(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationException(`${fieldName} cannot be empty`);
    }
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isNotNull<T>(value: T, fieldName: string): void {
    if (value === null || value === undefined) {
      throw new ValidationException(`${fieldName} cannot be null or undefined`);
    }
  }

  static hasMinLength(
    value: string,
    minLength: number,
    fieldName: string,
  ): void {
    if (value.length < minLength) {
      throw new ValidationException(
        `${fieldName} must have at least ${minLength} characters`,
      );
    }
  }

  static hasMaxLength(
    value: string,
    maxLength: number,
    fieldName: string,
  ): void {
    if (value.length > maxLength) {
      throw new ValidationException(
        `${fieldName} must have at most ${maxLength} characters`,
      );
    }
  }
}
