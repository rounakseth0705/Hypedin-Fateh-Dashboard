import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

interface IUser extends mongoose.Document {
    name: string,
    email: string,
    phoneNo: string,
    password: string,
    role: "Ambassador" | "Admin" | "POC",
    hasChangePassword: boolean,
    status: "Active" | "Back Out",
    comparePassword(password: string): Promise<boolean| null>,
    createJWT(): Promise<string | null>
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, default: "Ambassador" },
    hasChangePassword: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: "Active" }
},{ timestamps: true });

userSchema.pre("save", async function() {
    if (this.isNew) {
        (this as any)._wasNew = true;
    }

    if (!this.isModified("password")) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return;
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }
    }
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean | null> {
    try {
        const result: boolean = await bcrypt.compare(password, this.password);

        return result;
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return null;
    }
}

userSchema.methods.createJWT = function(): string | null {
    try {
        const token = jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        return token;
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return null;
    }
}

const UserModel = mongoose.model<IUser>("user", userSchema);

export default UserModel;