import Product from "../models/Product.js";

/* =====================================
   VENDOR CREATE PRODUCT (BEST PRACTICE)
===================================== */
export const vendorCreateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      brand,
      description,
      sizes,
      colors,
    } = req.body;

    // basic validation
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      originalPrice,
      category,
      brand,
      description,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      vendor: req.user._id,
      status: "pending",
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/* =====================================
   GET PRODUCTS BY VENDOR
===================================== */
export const getProductsByVendor = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* =====================================
   ADMIN APPROVE PRODUCT
===================================== */
export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
};

/* =====================================
   ADMIN REJECT PRODUCT
===================================== */
export const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Rejection failed" });
  }
};

/* =====================================
   ADMIN – GET ALL PRODUCTS (?status)
===================================== */
export const getProducts = async (req, res) => {
  try {
    const filter = req.query.status
      ? { status: req.query.status }
      : {};

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* =====================================
   PUBLIC – SINGLE PRODUCT
===================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/* =====================================
   PUBLIC – PRODUCTS BY CATEGORY
===================================== */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      status: "approved",
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* =====================================
   PUBLIC – ALL APPROVED PRODUCTS
===================================== */
export const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "approved",
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
