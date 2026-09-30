import type { Address } from "@/entities/user/model/userTypes";

export function createAddressDraft(
  existingAddresses: Address[],
  timestamp = Date.now(),
): Address {
  const usedIds = new Set(existingAddresses.map((address) => address.id));
  let nextId = Number.isSafeInteger(timestamp) && timestamp > 0 ? timestamp : 1;
  while (usedIds.has(nextId)) {
    nextId = nextId === Number.MAX_SAFE_INTEGER ? 1 : nextId + 1;
  }

  return {
    id: nextId,
    label: "새 배송지",
    recipient: "",
    phone: "",
    zipCode: "",
    address: "",
    addressDetail: "",
    isDefault: false,
  };
}

export function normalizeAddressDraft(address: Address): Address | null {
  const normalized = {
    ...address,
    label: address.label.trim(),
    recipient: address.recipient.trim(),
    phone: address.phone.trim(),
    zipCode: address.zipCode.trim(),
    address: address.address.trim(),
    addressDetail: address.addressDetail.trim(),
  };

  if (
    !normalized.label ||
    !normalized.recipient ||
    !normalized.phone ||
    !normalized.zipCode ||
    !normalized.address
  ) {
    return null;
  }

  return normalized;
}
