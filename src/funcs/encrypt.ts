import crypto from 'crypto';
import * as base64 from 'base64-js';
import * as argon2 from 'argon2';
import CryptoJS from 'crypto-js';

// Encrypt using bcrypt
export async function encrypt(str: string): Promise<string> {
    try {
        const hashedStr = await argon2.hash(str);
        return hashedStr;
    } catch (err) {
        throw err;
    }
}

// Check encrypted string using bcrypt
export async function encryptCheck(str: string, hashedStr: string): Promise<boolean> {
    try {
        const isMatch = await argon2.verify(hashedStr, str);
        return isMatch;
    } catch (err) {
        return false;
    }
}

// Encrypt with AES-GCM using a private key
export async function encryptWithPrivateKey(data: string): Promise<string> {
    return CryptoJS.AES.encrypt(data, import.meta.env.SESSION_KEY).toString();
}


// Decrypt with AES-GCM using a private key
export async function decryptWithPrivateKey(encryptedData: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.SESSION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Generate a random string
export function generateRandomString(length: number): string {
    const bytesNeeded = Math.ceil((length * 6) / 8);
    const randomBytes = crypto.randomBytes(bytesNeeded);
    let randomStr = base64.fromByteArray(randomBytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    if (randomStr.length > length) {
        randomStr = randomStr.slice(0, length);
    }
    return randomStr;
}
