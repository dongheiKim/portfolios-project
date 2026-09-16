import type { Review } from "../model/reviewTypes";
import { generateMockReviews } from "./reviewApi.mock";

export async function fetchReviewsByProductId(
  productId: number,
): Promise<Review[]> {
  return generateMockReviews(productId);
}
