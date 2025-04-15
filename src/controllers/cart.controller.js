import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";


const getCartByBuyerId = asyncHandler(async (req, res) => {
    const buyer_id = req.user._id;

    const cart = await Cart.findOne({ buyer_id, status:'open'}).populate("products.product_id");
    if (!cart) {
        console.log("creating new cart");
        const cart = await Cart.create({buyer_id:buyer_id, status:'open', products:[]});
        await cart.save();
        return res.status(200).json({ message: "cart fetched successfully", cart});
    }

    res.status(200).json({ message: "Cart fetched successfully", cart });
});

const addProductToCart = asyncHandler(async (req, res) => {
    const buyer_id = req.user._id;
    const { product_id, quantity } = req.body;

    const cart = await Cart.findOne({ buyer_id:buyer_id, status:'open'});
    if (!cart) {
        console.log("creating new cart");
        const cart = await Cart.create({buyer_id:buyer_id, status:'open', products:[{product_id , quantity}]});
        await cart.save();
        return res.status(200).json({ message: "Product added to cart", cart });
    }

    const product = await Product.findById(product_id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const existingProduct = cart.products.find(p => p.product_id.toString() === product_id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product_id, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: "Product added to cart", cart });
});

const removeProductFromCart = asyncHandler(async (req, res) => {
    const buyer_id = req.user._id;
    const { product_id } = req.body;

    const cart = await Cart.findOne({ buyer_id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(p => p.product_id.toString() !== product_id);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
});


const deleteCart = asyncHandler(async (req, res) => {
    const buyer_id = req.user._id;

    const cart = await Cart.findOneAndDelete({buyer_id: buyer_id, status:'open' });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
});

export {  getCartByBuyerId, addProductToCart, removeProductFromCart, deleteCart };
