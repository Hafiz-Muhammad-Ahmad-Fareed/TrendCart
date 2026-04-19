import asyncHandler from "../utils/async_handler.js";
import * as catalogService from "../services/catalog.service.js";

export const getPublicCategories = asyncHandler(
  catalogService.getPublicCategories,
);
export const getProductsByCategorySlug = asyncHandler(
  catalogService.getProductsByCategorySlug,
);
export const getProductBySlug = asyncHandler(catalogService.getProductBySlug);
export const getSimilarProducts = asyncHandler(catalogService.getSimilarProducts);
