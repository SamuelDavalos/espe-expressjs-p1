const { registerUser, loginUser } = require("../services/authService");
const { isValidEmail } = require("../utils/validation");

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    await registerUser(email, password, name);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    return res.json({ token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
