import asyncHandler from "../utils/async_handler.js";
import * as orderService from "../services/order.service.js";

export const createCheckoutSession = asyncHandler(orderService.createCheckoutSession);
export const handleWebhook = asyncHandler(orderService.handleWebhook);
export const getUserOrders = asyncHandler(orderService.getUserOrders);
