import mongoose from "mongoose";
import bcrypt from "bcrypt"

// Define the schema for the data entry
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_photo: {
    type: String,
    required: false,
    default: null
  },

}, {
  timestamps: true // This will add createdAt and updatedAt timestamps
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(user.password, salt)

    user.password = hashPassword
    next();
  } catch (error) {
  }
})

userSchema.methods.comparePassword = async function (password) {
  try {

    const isMatched = await bcrypt.compare(password, this.password)
    return isMatched;
  } catch (error) {

  }

}

const User = mongoose.model("User", userSchema);

export default User;
