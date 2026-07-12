const mongoose = require("mongoose");


const billSchema = new mongoose.Schema(
{
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },


    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },


    consultationFee: {
        type: Number,
        default: 0
    },


    medicineCharges: {
        type: Number,
        default: 0
    },


    labCharges: {
        type: Number,
        default: 0
    },


    totalAmount: {
        type: Number,
        required: true
    },


    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid"
        ],
        default: "Pending"
    }


},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Bill",
    billSchema
);