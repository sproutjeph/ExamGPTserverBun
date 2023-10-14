import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  subjectVideo: Array<{ subjectVideoId: string }>;
  apiUseageCount: number;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      validate: {
        validator: (email: string) => emailRegexPattern.test(email),
        message: "Please provide a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    subjectVideo: [
      {
        subjectVideoId: String,
      },
    ],
    apiUseageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await Bun.password.hash(this.password);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, ACCESS_TOKEN || "", { expiresIn: "5m" });
};
// sign resfresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, REFRESH_TOKEN || "", { expiresIn: "7d" });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await Bun.password.verify(enteredPassword, this.password);
};

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
