import mongoose from 'mongoose';
import { WasteTypeEnum, BinStatusEnum } from './enums.js';

const wastebinSchema = new mongoose.Schema({
    binId: { // PK
        type: String,
        required: true,
        unique: true
    },
    binTag: { // RFID, Barcode, or Sensor ID
        type: String,
        required: true,
        unique: true
    },
    binStatus: { //
        type: String,
        enum: BinStatusEnum,
        default: 'EMPTY'
    },
    wasteType: { //
        type: String,
        enum: WasteTypeEnum,
        required: true
    },
    fillLevel: { // Percentage or measured unit
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    owner: { // Resident who owns the bin 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
    lastCollection: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Wastebin = mongoose.model('Wastebin', wastebinSchema);
export default Wastebin;