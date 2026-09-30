import { isPasswordLengthValid } from "@/features/auth/model/passwordPolicy";

const PBKDF2_ITERATIONS = 120_000;

export interface PasswordVerifier {
  passwordSalt: string;
  passwordHash: string;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function fromHex(value: string): Uint8Array | null {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) return null;
  return Uint8Array.from(value.match(/.{2}/g) ?? [], (byte) =>
    Number.parseInt(byte, 16),
  );
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array,
): Promise<string> {
  const passwordBytes = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(passwordBytes),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: toArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return toHex(new Uint8Array(hash));
}

export async function createPasswordVerifier(
  password: string,
): Promise<PasswordVerifier> {
  if (!isPasswordLengthValid(password)) {
    throw new RangeError("Password length is outside the supported range.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  return {
    passwordSalt: toHex(salt),
    passwordHash: await derivePasswordHash(password, salt),
  };
}

export async function verifyPassword(
  password: string,
  passwordSalt: string,
  expectedHash: string,
): Promise<boolean> {
  if (!isPasswordLengthValid(password)) return false;

  const salt = fromHex(passwordSalt);
  const hash = fromHex(expectedHash);
  if (!salt || !hash || hash.length !== 32) return false;

  const actualHash = await derivePasswordHash(password, salt);
  let difference = 0;
  for (let index = 0; index < expectedHash.length; index += 1) {
    difference |= expectedHash.charCodeAt(index) ^ actualHash.charCodeAt(index);
  }
  return difference === 0;
}
