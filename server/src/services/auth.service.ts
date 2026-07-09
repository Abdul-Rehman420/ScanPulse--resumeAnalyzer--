import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { AppError, UnauthorizedError } from "../utils/errors";
import { AuthPayload } from "../middleware/auth.middleware";

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
    token,
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
}

function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}
