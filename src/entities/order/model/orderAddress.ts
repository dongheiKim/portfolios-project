import type { ShippingAddress } from "./orderTypes";

export function formatShippingAddress(
  address: Pick<ShippingAddress, "zipcode" | "address" | "addressDetail">,
): string {
  const zipcode = address.zipcode.trim();
  const lines = [
    zipcode ? `(${zipcode})` : "",
    address.address.trim(),
    address.addressDetail.trim(),
  ];

  return lines.filter(Boolean).join(" ");
}
