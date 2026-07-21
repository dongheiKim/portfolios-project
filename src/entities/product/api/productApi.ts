import type { ProductDetail } from "../model/productTypes";
import { findMockProductDetailById } from "./productApi.mock";

export async function fetchProductById(id: number): Promise<ProductDetail> {
  return findMockProductDetailById(id);
}
