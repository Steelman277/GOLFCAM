import mongoose from "mongoose";

export interface IUser {
  number: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  isManager: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        number: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        isManager: {
             type: Boolean,
             default: false,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;