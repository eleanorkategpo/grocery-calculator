import { GroceryItem } from "../../constants/Schema";

export const calculateTotal = (array: GroceryItem[]) => {
  return array.length === 0
    ? 0
    : array
        .filter((item): item is GroceryItem => Boolean(item))
        .reduce((sum, item) => sum + (item.total || 0), 0);
};
