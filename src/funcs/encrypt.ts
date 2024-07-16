import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as base64 from 'base64-js';

// Encrypt using bcrypt
export async function encrypt(str: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedStr = await bcrypt.hash(str, salt);
        return hashedStr;
    } catch (err) {
        throw err;
    }
}

// Check encrypted string using bcrypt
export async function encryptCheck(str: string, hashedStr: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(str, hashedStr);
        return isMatch;
    } catch (err) {
        return false;
    }
}

// Encrypt with AES-GCM using a private key
export async function encryptWithPrivateKey(data: string): Promise<string> {
    try {
        const key = Buffer.from(import.meta.env.SESSION_KEY, 'base64');
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([iv, cipher.update(data, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        const encryptedData = Buffer.concat([iv, encrypted, tag]).toString('base64');
        return encryptedData;
    } catch (err) {
        throw err;
    }
}

// Decrypt with AES-GCM using a private key
export async function decryptWithPrivateKey(encryptedData: string): Promise<string> {
    try {
        const key = Buffer.from(import.meta.env.SESSION_KEY, 'base64');
        const data = Buffer.from(encryptedData, 'base64');
        const iv = data.slice(0, 12);
        const tag = data.slice(data.length - 16);
        const encrypted = data.slice(12, data.length - 16);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (err) {
        throw err;
    }
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
