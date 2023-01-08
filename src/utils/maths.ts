import {randomBytes} from "crypto";

export function generateDepositNote(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let depositNote = 'note-';
    const requiredLength = 50;

    while (depositNote.length < requiredLength) {
        const bytes = randomBytes(40);
        bytes.forEach(b => {
            // Length of `chars` is 62. We only take bytes between 0 and 62*4-1
            // (both inclusive). The value is then evenly mapped to indices of `char`
            // via a modulo operation.
            const maxValue = 62 * 4 - 1;
            if (depositNote.length < requiredLength && b <= maxValue) {
                depositNote += chars.charAt(b % 62);
            }
        });
    }
    return depositNote;
}

export async function hash(string: string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
}