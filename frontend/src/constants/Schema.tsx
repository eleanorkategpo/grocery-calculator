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

export type CartItem = {
  id: string;
  barcode: string;
  description: string;
  price: number;
  quantity: number;
};


