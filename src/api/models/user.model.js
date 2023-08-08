import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:  { type: String, required: true },
    last_name:  { type: String},
    email:  { type: String, required: true, unique: true },
    age:  { type: Number},
    password:  { type: String },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {type: String, default: "user"},
})

/**
 * Middleware for populate the searchs
 */
userSchema.pre("find", function () {
    this.populate("carts");
  });

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel