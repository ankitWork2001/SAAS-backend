import Product from "../../models/Product.js";

export const introduceProduct = async (req, res) => {
  const { name, description, isAvailable } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      isAvailable,
      imageUrl: req.file ? req.file.path : null, // Assuming you're using multer for file uploads
      features: req.body.features ? req.body.features.split(",") : [], // Assuming features are passed as a comma-separated string
    });

    await newProduct.save();
    res.status(201).json({
      message: "Product introduced successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error introducing product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isAvailable = false;
    await product.save();

    res.status(200).json({ message: "Product blocked successfully" });
  } catch (error) {
    console.error("Error blocking product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, isAvailable } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.description = description;
    product.isAvailable = isAvailable;

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};