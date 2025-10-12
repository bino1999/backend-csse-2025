import mongoose from 'mongoose';

// --- Routestop Schema ---
// Routestop is used to define the sequence of collection points for a Route
const routestopSchema = new mongoose.Schema({
    intOrder: { // The sequence number
        type: Number,
        required: true
    },
    addressLocation: { // Address where the collection occurs
        type: String, // Simplified as a string for now
        required: true
    },
    wastebin: { // The bin to be collected at this stop
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wastebin',
        required: true
    },
    collectionRecorded: { // Flag to track if the crew collected it
        type: Boolean,
        default: false
    }
}, {
    _id: false // Often omitted when embedded or managed by the parent
});

const Routestop = mongoose.model('Routestop', routestopSchema);

// --- Route Schema ---
const routeSchema = new mongoose.Schema({
    routeId: { // PK
        type: String,
        required: true,
        unique: true
    },
    routeName: { //
        type: String,
        required: true
    },
    scheduleDate: { //
        type: Date,
        required: true
    },
    status: { // e.g., 'PLANNED', 'IN_PROGRESS', 'COMPLETED'
        type: String,
        default: 'PLANNED'
    },
    assignedCrew: { //
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionCrewMember',
        required: false // Can be assigned later
    },
    routeStops: [routestopSchema] // Array of Routestop sub-documents/references
}, {
    timestamps: true
});

const Route = mongoose.model('Route', routeSchema);

export { Route, Routestop };