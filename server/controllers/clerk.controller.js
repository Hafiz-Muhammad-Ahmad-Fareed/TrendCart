import asyncHandler from "../utils/async_handler.js";
import * as clerkService from "../services/clerk.service.js";

export const clerkUserManagement = asyncHandler(
  clerkService.clerkUserManagement,
);
