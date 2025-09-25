import { ValidationException, Validators } from '@app/shared';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  private validate(value: string): void {
    Validators.isNotEmpty(value, 'Email');
    
    if (!Validators.isValidEmail(value)) {
      throw new ValidationException('Invalid email format');
    }
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
