import Product from "../models/Product.js";
import User from "../models/User.js";

export const viewAllAvailableProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProductToUser = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.isAvailable) {
      return res.status(400).json({ message: "Product is not available" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.products.includes(productId)) {
      return res.status(400).json({ message: "Product already added to user" });
    }
    user.products.push(productId);
    await user.save();
    res.status(200).json({ message: "Product added to user" });
  } catch (error) {
    console.error("Error adding product to user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const subscribedProductsOfUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(userId).populate("products");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subscribed products fetched successfully",
      products: user.products,
    });
  } catch (error) {
    console.error("Error fetching subscribed products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
