import Product from "../models/Product.js";

export const getProducts =
  async (req, res) => {
    res.json(
      await Product.find()
    );
  };

export const createProduct =
  async (req, res) => {

    const product =
      await Product.create(
        req.body
      );

    res.status(201).json(
      product
    );
  };

export const updateProduct =
  async (req, res) => {

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(product);
  };