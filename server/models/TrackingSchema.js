import mongoose from "mongoose";
const { Schema } = mongoose;

const TrackingSchema = new Schema(
  {
    parcelID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parcels",
    },

    trackingID: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    manualDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const TrackingModel = mongoose.model("tags", TrackingSchema);

export default TrackingModel;
