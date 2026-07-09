export interface Address {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  addresses: Address[];
  createdAt: string;
}
