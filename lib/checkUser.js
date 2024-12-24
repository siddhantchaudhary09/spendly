import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

// Ensure Prisma Client uses a single instance in development
const prisma = globalThis.prisma || db;

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export const checkUser = async () => {
  try {
    // Fetch the current user from Clerk
    const user = await currentUser();

    // Return null if no user is logged in
    if (!user) {
      return null;
    }

    // Query the database to find the logged-in user
    const loggedInUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // If the user exists in the database, return them
    if (loggedInUser) {
      return loggedInUser;
    }

    // Handle case where the user does not exist in the database
    if (!user.emailAddresses?.length) {
      throw new Error("No email address found for the current user");
    }

    // Create a new user if they do not exist
    const name = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "unknown@example.com",
        name,
        imageUrl: user.imageUrl ?? "", // Default to an empty string if no image
      },
    });

    // Return the newly created user
    return newUser;
  } catch (error) {
    console.error("Error checking or creating user:", error.message);

    // Optionally rethrow the error if you want to handle it at a higher level
    throw error;
  }
};
