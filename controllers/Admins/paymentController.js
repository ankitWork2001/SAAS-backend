import Subscription from "../../models/subscription.model";

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

 // Fetch specific payment made by a particular user from userid .
export const fetchPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Subscription.findById(id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch payment",
            error: error.message,
        });
    }
};