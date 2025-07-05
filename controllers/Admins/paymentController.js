import Subscription from "../../models/Subscription.js";

export const viewAllOrders = async (req, res) => {
    try {
        const orders = await Subscription.find()
            .populate("plan", "name")
            .populate("user", "name email mobile");
        
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};

 // Fetch specific payment made by a particular user from /:userid/:orderId .
export const fetchPayment = async (req, res) => {
    try {
        const { userId , orderId } = req.params;
        const order = await Subscription.findOne({ user: userId, razorpayOrderId: orderId });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};