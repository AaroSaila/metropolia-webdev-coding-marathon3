import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  membership_status: { type: String, required: true },
  address: { type: String, required: true },
  profile_picture: { type: String, required: false }
}, { timestamps: true, versionKey: false });


userSchema.statics.signup = async function (user) {
    if (!user.password) {
        throw Error("Password is required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(user.password, salt);

    return await this.create({...user, password: hashedPwd});
};


export default mongoose.model("User", userSchema);
