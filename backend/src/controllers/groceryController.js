import Grocery from "../models/groceryModel.js";
import GroceryItem from "../models/groceryItemModel.js";

export const getGroceryItemsById = async (req, res, next) => {
  try {
    const groceryItems = await GroceryItem.find({ groceryId: req.params.id });
    res.status(200).json({ status: "success", data: { groceryItems } });
  } catch (error) {
    next(error);
  }
};

export const createGroceryItem = async (req, res, next) => {
  try {
    const groceryItem = await GroceryItem.create(req.body);
    res.status(201).json({ status: "success", data: { groceryItem } });
  } catch (error) {
    next(error);
  }
};

export const updateGroceryItem = async (req, res, next) => {
  try {
    const groceryItem = await GroceryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ status: "success", data: { groceryItem } });
  } catch (error) {
    next(error);
  }
};

export const deleteGroceryItem = async (req, res, next) => {
  try {
    await GroceryItem.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export const getPreviousCarts = async (req, res, next) => {
  try {
    const previousCarts = await Grocery.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "groceryId",
          as: "items",
        },
      },
      {
        $unwind: {
          path: "$items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          storeName: { $first: "$storeName" },
          budget: { $first: "$budget" },
          totalAmount: { $sum: "$items.total" },
        },
      },
    ]);

    if (!previousCarts.length) {
      return res.status(404).json({ status: "fail", message: "No previous carts found" });
    }

    res.status(200).json({ status: "success", data: { previousCarts } });
  } catch (error) {
    next(error);
  }
};

export const getGroceryById = async (req, res, next) => {
  try {
    const grocery = await Grocery.findOne({ id: req.params.id });
    if (!grocery) {
      return res
        .status(404)
        .json({ status: "fail", message: "Grocery not found" });
    }
    res.status(200).json({ status: "success", data: { grocery } });
  } catch (error) {
    next(error);
  }
};

export const createGrocery = async (req, res, next) => {
  try {
    const grocery = await Grocery.create(req.body);
    res.status(201).json({ status: "success", data: { grocery } });
  } catch (error) {
    next(error);
  }
};

export const updateGrocery = async (req, res, next) => {
  try {
    const grocery = await Grocery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: "success", data: { grocery } });
  } catch (error) {
    next(error);
  }
};

export const deleteGrocery = async (req, res, next) => {
  try {
    await Grocery.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};
