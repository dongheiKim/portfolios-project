import type { ShippingAddress } from "@/entities/order";
import type { User } from "@/entities/user";

export function createInitialShippingAddress(
  user: User | null,
): ShippingAddress {
  const savedAddress =
    user?.addresses.find((candidate) => candidate.isDefault) ??
    user?.addresses[0];

  return {
    recipient: savedAddress?.recipient ?? user?.name ?? "",
    phone: savedAddress?.phone ?? user?.phone ?? "",
    address: savedAddress?.address ?? "",
    city: savedAddress?.address ?? "",
    street: savedAddress?.addressDetail ?? "",
    zipcode: savedAddress?.zipCode ?? "",
    addressDetail: savedAddress?.addressDetail ?? "",
  };
}
