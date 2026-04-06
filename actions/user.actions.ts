"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { AddressSchema } from "@/lib/validations";

const ProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export const updateProfileAction = actionClient(ProfileSchema, async (parsedInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorised");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: parsedInput.firstName,
      lastName: parsedInput.lastName,
      phone: parsedInput.phone,
    },
  });
  revalidatePath("/account/profile");
  return { success: true as const };
});

export const createAddressAction = actionClient(AddressSchema, async (parsedInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorised");

  await prisma.address.create({
    data: {
      userId: session.user.id,
      firstName: parsedInput.firstName,
      lastName: parsedInput.lastName,
      addressLine1: parsedInput.addressLine1,
      addressLine2: parsedInput.addressLine2,
      city: parsedInput.city,
      state: parsedInput.state,
      postalCode: parsedInput.postalCode,
      country: parsedInput.country,
      phone: parsedInput.phone,
    },
  });
  revalidatePath("/account/addresses");
  return { success: true as const };
});
