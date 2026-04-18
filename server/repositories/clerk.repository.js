import User from "../db/models/User.model.js";

export const upsertUser = async (clerkId, userData) => {
  return await User.findOneAndUpdate(
    { clerkId },
    { $setOnInsert: userData },
    {
      upsert: true,
      returnDocument: "after",
    },
  );
};

export const updateUserByClerkId = async (clerkId, updateData) => {
  return await User.findOneAndUpdate(
    { clerkId },
    { $set: updateData },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export const deleteUserByClerkId = async (clerkId) => {
  return await User.findOneAndDelete({ clerkId });
};
