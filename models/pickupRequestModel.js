import mongoose from 'mongoose';
import { RequestStatusEnum, WasteTypeEnum } from './enums.js';

const pickupRequestSchema = new mongoose.Schema({
    requestId: { // PK
        type: String,
        required: true,
        unique: true
    },
    requestType: { // e.g., 'Bulky Item Collection' 
        type: String,
        enum: WasteTypeEnum.filter(type => type === 'BULK' || type === 'E_WASTE'), // Only for bulky/special waste
        required: true
    },
    description: { //
        type: String,
        required: true
    },
    scheduledDate: { //
        type: Date,
        required: true
    },
    status: { //
        type: String,
        enum: RequestStatusEnum,
        default: 'PENDING'
    },
    resident: { // The Resident who made the request
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
}, {
    timestamps: true
});

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;