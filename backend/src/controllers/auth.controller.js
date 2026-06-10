import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    region
  } = req.body;

  const exists =
    await User.findOne({ email });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "User already exists"
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    region
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user
  });
};

export const login = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const user =
    await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const match =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user
  });
};

export const me = async (
  req,
  res
) => {
  res.json(req.user);
};