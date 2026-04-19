import asyncHandler from "../utils/async_handler.js";
import * as adminService from "../services/admin.service.js";

export const getDashboardStats = asyncHandler(adminService.getDashboardStats);
export const getCategories = asyncHandler(adminService.getCategories);
export const createCategory = asyncHandler(adminService.createCategory);
export const updateCategory = asyncHandler(adminService.updateCategory);
export const deleteCategory = asyncHandler(adminService.deleteCategory);
export const getProducts = asyncHandler(adminService.getProducts);
export const createProduct = asyncHandler(adminService.createProduct);
export const updateProduct = asyncHandler(adminService.updateProduct);
export const deleteProduct = asyncHandler(adminService.deleteProduct);
export const getUsers = asyncHandler(adminService.getUsers);
export const updateUserRole = asyncHandler(adminService.updateUserRole);
export const deleteUser = asyncHandler(adminService.deleteUser);
