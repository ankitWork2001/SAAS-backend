import Plan from "../../models/Plan.js";

export const introducePlan = async (req, res) => {
  try {
    const { name, priceMonthly, priceYearly, features } = req.body;

    if (!name || !priceMonthly) {
      return res.status(400).json({success: false, message: "Name and monthly price are required." });
    }

    const newPlan = new Plan({
      name,
      priceMonthly,
      priceYearly: priceYearly || 12*priceMonthly,
      features,
    });

    await newPlan.save();

    res.status(201).json({success: true, message: "Plan introduced successfully.", plan: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


export const blockPlan = async (req, res) => {
  try {
    const { planID } = req.params;

    const updatedPlan = await Plan.findByIdAndUpdate(
      planID,
      { isAvailable: false },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({success: false, message: "Plan not found." });
    }

    res.status(200).json({success: true, message: "Plan blocked successfully.", plan: updatedPlan });
  } catch (error) {
    res.status(500).json({success: false, message: "Server error.", error: error.message });
  }
};


export const activateBlockedPlan = async (req, res) => {
  try {
    const { planID } = req.params;

    const updatedPlan = await Plan.findByIdAndUpdate(
      planID,
      { isAvailable: true },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({success: false, message: "Plan not found." });
    }

    res.status(200).json({success: true, message: "Plan activated successfully.", plan: updatedPlan });
  } catch (error) {
    res.status(500).json({success: false, message: "Server error.", error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { planID } = req.params;
    const { name, priceMonthly, priceYearly, features, isAvailable } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      planID,
      { name, priceMonthly, priceYearly, features, isAvailable },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({success: false, message: "Plan not found." });
    }

    res.status(200).json({ success: true, message: "Plan updated successfully.", plan: updatedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};
