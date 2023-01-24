import {sha256} from "js-sha256";

const randomBytes = require("randombytes");

export function generateRandomString(length: number): string {
    const charset = "abcdef0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const random = randomBytes(1)[0];
        result += charset[random % charset.length];
    }

    return result;
}

export async function hash(string: string): Promise<string> {
    const utf8 = new TextEncoder().encode(string);
    return sha256(utf8);
}