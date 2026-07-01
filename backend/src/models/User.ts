import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { User, Address } from "../types/User";

export interface UserDocument extends Omit<User, "id"> {
  _id: mongoose.Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
}

const addressSchema = new Schema<Address>(
  {
    type: {
      type: String,
      enum: ["home", "office", "other"],
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    profile: {
      name: {
        type: String,
        required: true,
      },
      phone: String,
      avatar: String,
    },

    addresses: [addressSchema],

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// ==========================
// Hash password before saving
// ==========================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================
// Compare Password
// ==========================
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// ==========================
// Remove password from JSON
// ==========================
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;

  return obj;
};

export const UserModel = mongoose.model<UserDocument>(
  "User",
  userSchema
);