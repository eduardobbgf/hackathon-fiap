import { ValidationException, Validators } from '@app/shared';
import * as bcrypt from 'bcryptjs';

export class Password {
  private readonly _hashedValue: string;

  private constructor(hashedValue: string) {
    this._hashedValue = hashedValue;
  }

  public static async create(plainPassword: string): Promise<Password> {
    this.validatePassword(plainPassword);
    const hashedValue = await bcrypt.hash(plainPassword, 12);
    return new Password(hashedValue);
  }

  public static fromHash(hashedValue: string): Password {
    Validators.isNotEmpty(hashedValue, 'Password hash');
    return new Password(hashedValue);
  }

  private static validatePassword(password: string): void {
    Validators.isNotEmpty(password, 'Password');
    Validators.hasMinLength(password, 8, 'Password');
    
    if (!Validators.isValidPassword(password)) {
      throw new ValidationException(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
      );
    }
  }

  public async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this._hashedValue);
  }

  public get hashedValue(): string {
    return this._hashedValue;
  }
}
