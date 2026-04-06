"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { LoginSchema, RegisterSchema } from "@/lib/validations";

export const registerAction = actionClient(RegisterSchema, async (parsedInput) => {
  const email = parsedInput.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(parsedInput.password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: parsedInput.firstName,
      lastName: parsedInput.lastName,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsedInput.password,
      redirect: false,
    });
  } catch (e) {
    if (e instanceof AuthError) throw new Error("Account created but sign-in failed. Please sign in.");
    throw e;
  }

  revalidatePath("/", "layout");
  return { success: true as const };
});

export const loginAction = actionClient(LoginSchema, async (parsedInput) => {
  try {
    await signIn("credentials", {
      email: parsedInput.email.toLowerCase(),
      password: parsedInput.password,
      redirect: false,
    });
  } catch (e) {
    if (e instanceof AuthError) throw new Error("Invalid email or password");
    throw e;
  }
  revalidatePath("/", "layout");
  return { success: true as const };
});

export const logoutAction = actionClient(z.object({}), async () => {
  await signOut({ redirect: false });
  revalidatePath("/", "layout");
  return { success: true as const };
});
