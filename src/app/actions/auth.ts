"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
}

export async function registerUser(formData: RegisterFormData) {
  try {
    const { username, email, password } = formData;

    const existingEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingEmail) {
      return { success: false, error: "User with this email already exists." };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUsername) {
      return {
        success: false,
        error: "User with this username already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    await createAuthSession(newUser.id, newUser.email);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        "Something went wrong while registering the user. Please try again.",
    };
  }
}

export async function loginUser(formData: LoginFormData) {
  try {
    const { email, password } = formData;
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password." };
    }

    await createAuthSession(user.id, user.email);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Something went wrong. Try again." };
  }
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    return null;
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: "Logout failed" };
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSessionUser();

    if (!session) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        username: true,
      },
    });

    if (!user) return null;

    return user.username;
  } catch (error) {
    return null;
  }
}

async function createAuthSession(userId: string, email: string) {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
