import User from "../db/models/User.model.js";

export const syncUserToDatabase = async (clerkUser) => {
  try {
    if (!clerkUser?.id) {
      throw new Error("Invalid Clerk user data - missing id");
    }

    let email = null;

    if (clerkUser?.email_addresses?.[0]?.email_address) {
      email = clerkUser.email_addresses[0].email_address;
    }

    const existingUser = await User.findOne({ clerkId: clerkUser.id });

    if (existingUser) {
      if (email && email !== existingUser.email) {
        const emailExists = await User.findOne({
          email: email.toLowerCase(),
          clerkId: { $ne: clerkUser.id },
        });

        if (emailExists) {
          console.warn(
            `⚠️ Email ${email} already exists for another user. Skipping email update.`,
          );
        } else {
          existingUser.email = email.toLowerCase();
        }
      }

      existingUser.firstName = clerkUser.first_name || "";
      existingUser.lastName = clerkUser.last_name || "";
      existingUser.fullName = `${clerkUser.first_name || ""} ${
        clerkUser.last_name || ""
      }`.trim();
      existingUser.profileImage = clerkUser.profile_image_url || "";

      await existingUser.save();
      return existingUser;
    } else {
      if (email) {
        const emailExists = await User.findOne({
          email: email.toLowerCase(),
        });

        if (emailExists) {
          throw new Error(
            `Email ${email} already exists in database for another user`,
          );
        }
      }

      const userData = {
        clerkId: clerkUser.id,
        email: email?.toLowerCase() || null,
        firstName: clerkUser.first_name || "",
        lastName: clerkUser.last_name || "",
        fullName: `${clerkUser.first_name || ""} ${
          clerkUser.last_name || ""
        }`.trim(),
        profileImage: clerkUser.profile_image_url || "",
      };

      const user = await User.create(userData);
      return user;
    }
  } catch (error) {
    console.error("❌ Error syncing user to database:", error.message);
    throw error;
  }
};

export const deleteUser = async (clerkId) => {
  try {
    if (!clerkId) {
      throw new Error("clerkId is required to delete user");
    }
    await User.findOneAndDelete({ clerkId });
  } catch (error) {
    console.error("❌ Error deleting user from database:", error.message);
    throw error;
  }
};
