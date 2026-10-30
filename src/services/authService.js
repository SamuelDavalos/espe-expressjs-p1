const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const registerUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "USER",
    },
  });
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );
};

module.exports = { registerUser, loginUser };
