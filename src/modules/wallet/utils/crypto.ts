import type { EncryptedVault } from "@/types/wallet";
import { PBKDF2_ITERATIONS, VAULT_STORAGE_KEY } from "./constants";

function bufToHex(buf: ArrayBuffer | Uint8Array<ArrayBuffer>): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [];
  return new Uint8Array(bytes) as Uint8Array<ArrayBuffer>;
}

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMnemonic(
  mnemonic: string,
  password: string
): Promise<EncryptedVault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(mnemonic)
  );
  return {
    ciphertext: bufToHex(ciphertext),
    iv: bufToHex(iv),
    salt: bufToHex(salt),
  };
}

export async function decryptMnemonic(
  vault: EncryptedVault,
  password: string
): Promise<string> {
  const salt = hexToBuf(vault.salt);
  const iv = hexToBuf(vault.iv);
  const ciphertext = hexToBuf(vault.ciphertext);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

export function saveVault(vault: EncryptedVault): void {
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
}

export function loadVault(): EncryptedVault | null {
  const raw = localStorage.getItem(VAULT_STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as EncryptedVault;
}

export function clearVault(): void {
  localStorage.removeItem(VAULT_STORAGE_KEY);
}

export function hasVault(): boolean {
  return localStorage.getItem(VAULT_STORAGE_KEY) !== null;
}
