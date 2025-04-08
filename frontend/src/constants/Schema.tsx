export type UserSchema = {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role?: string;
  createdAt?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
};


