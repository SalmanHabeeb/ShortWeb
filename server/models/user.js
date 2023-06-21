const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const config = require("../config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: false,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      console.error(error);
    }
  }
});

userSchema.method("generateAuthToken", async function () {
  try {
    let token = jwt.sign(
      { id: this._id, date: Date.now().toString() },
      config.keyForUserAuthTokenGen
    );
    this.tokens.push({ token: token });
    await this.save();
    return { token: token, error: false };
  } catch (error) {
    console.error(error);
    return { token: null, error: true };
  }
});

userSchema.statics.findByToken = function (token) {
  let user = this;
  let decoded;
  try {
    decoded = jwt.verify(token, config.keyForUserAuthTokenGen);
  } catch (error) {
    return Promise.reject(error);
  }
  return user.findOne({
    _id: decoded.id,
    "tokens.token": token,
  });
};

module.exports = mongoose.model("User", userSchema);
