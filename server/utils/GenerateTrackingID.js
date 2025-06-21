// utils/generateTrackingID.js
import ParcelModel from '../models/ParcelModel.js';

export const GenerateTrackingID = async (agencyCode, destinationCountry) => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;

    const baseTrackingPrefix = `${agencyCode}-${destinationCountry}-${formattedDate}`;

    // Find last matching parcel with the same prefix
    const lastParcel = await ParcelModel.findOne({
        trackingID: { $regex: `^${baseTrackingPrefix}-\\d+$` },
    }).sort({ trackingID: -1 });

    // Determine next sequence number
    let nextSequence = 1;
    if (lastParcel) {
        const lastSequence = parseInt(lastParcel.trackingID.split('-').pop(), 10);
        nextSequence = lastSequence + 1;
    }

    const paddedSequence = String(nextSequence).padStart(3, '0');
    return `${baseTrackingPrefix}-${paddedSequence}`;
};
