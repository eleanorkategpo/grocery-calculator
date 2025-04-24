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

export type GroceryItem = {
  _id: string;
  barcode: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  groceryId: string;
};


export type Grocery = {
  _id?: string;
  storeName: string;
  budget: number;
  createdAt: Date;
  updatedAt: Date;
  checkoutDate: Date;
  totalAmount: number;
  paidWith: string;
  amountTendered: number;
  items: GroceryItem[];
};

