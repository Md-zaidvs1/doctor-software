const DentalChart = require('../models/DentalChart');

// 💡 Update or Create a Tooth Chart record entry
const updateToothCondition = async (req, res) => {
  try {
    const { patientId, toothNumber, condition, notes } = req.body;

    const updatedChart = await DentalChart.findOneAndUpdate(
      { patientId, toothNumber },
      { condition, notes, dateUpdated: new Date().toLocaleDateString('en-IN') },
      { new: true, upsert: true } // Creates record instantly if doesn't exist
    );

    res.status(200).json({ status: "success", data: updatedChart });
  } catch (err) {
    console.error("Odontogram Matrix Error:", err);
    res.status(500).json({ message: "Failed to update tooth state index parameters." });
  }
};

// 💡 Fetch full 32-teeth structural data map for a specific Patient
const getPatientDentalChart = async (req, res) => {
  try {
    const { patientId } = req.params;
    const fullChart = await DentalChart.find({ patientId });
    res.status(200).json(fullChart);
  } catch (err) {
    res.status(500).json({ message: "Odontogram grid lookup failed." });
  }
};

module.exports = {
  updateToothCondition,
  getPatientDentalChart
};