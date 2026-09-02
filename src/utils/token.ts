import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export function generateParticipantToken(): string {
    return randomBytes(32).toString('base64url');
}

export function hashParticipantToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

export function compareTokenHashes(
    providedToken: string,
    storedHash: string,
): boolean {
    const providedHash = hashParticipantToken(providedToken);

    const providedBuffer = Buffer.from(providedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (providedBuffer.length !== storedBuffer.length) {
        return false;
    }

    return timingSafeEqual(providedBuffer, storedBuffer);
}
