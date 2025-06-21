import mongoose from "mongoose";
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  parcelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parcels",
  },

  agencyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agencies",
    required: true,
  },

  officeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "offices",
    required: true,
  },

  pricePerKilo: {
    type: Number,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  actualCarrierCost: {
    type: Number,
    required: true,
  },

  grossProfit: {
    type: Number,
    required: true,
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  paymentStatus: {
    type: [String],
    enum: [
      "PENDING PAYMENT",
      "PARTIALLY PAID",
      "DEFERRED PAYMENT",
      "PAYMENT VALIDATED",
      "PAYMENT FAILED",
      "PAYMENT CANCELLED",
    ],
    default: ["PENDING PAYMENT"],
  },
});

TransactionSchema.index(
  { parcelID: 1, agencyID: 1, officeID: 1 },
  { unique: true }
);

const TransactionModel = mongoose.model("transactions", TransactionSchema);

export default TransactionModel;
