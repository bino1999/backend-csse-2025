import { Schema, model } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { AccountStatusEnum } from './enums.js';

// User Schema (Base Model)
const userSchema = new Schema({
    userId: { 
        type: String, 
        unique: true, 
        required: true,
        // In a real system, this would be auto-generated/managed externally 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    accountStatus: { 
        type: String, 
        enum: AccountStatusEnum, //
        default: 'ACTIVE' 
    },
}, {
    timestamps: true,
    discriminatorKey: 'role' // Key for Mongoose Discriminators
});

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

// Middleware: Hash password before saving if it has been modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
});

const User = model('User', userSchema);
export default User;

// --- Discriminators ---

// 1. Administrator
const Administrator = User.discriminator('Administrator', new Schema({
    department: { 
        type: String, 
        required: true 
    }
}));

// 2. Resident
const Resident = User.discriminator('Resident', new Schema({
    address: { 
        type: String, // Simplified
        required: true 
    },
    doubleBalance: { 
        type: Number, 
        default: 0 
    },
}));

// 3. CollectionCrewMember
const CollectionCrewMember = User.discriminator('CollectionCrewMember', new Schema({
    employeeId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    contactNumber: { 
        type: String 
    },
    vehicle: { 
        type: String ,
        required: false // Can be assigned later
    },
    address: { 
        type: String ,
        required: true // <--- REQUIRED 
    }
}));

export { User, Administrator, Resident, CollectionCrewMember };