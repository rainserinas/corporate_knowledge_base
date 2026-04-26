const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(ip: string) {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return { success: true };
    }

    if (now - record.lastAttempt > WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return { success: true };
    }

    if (record.count >= MAX_ATTEMPTS) {
        const remainingTime = Math.ceil((record.lastAttempt + WINDOW_MS - now) / 1000 / 60);
        return {
            success: false,
            retryAfterMinutes: remainingTime,
        };
    }

    record.count++;
    record.lastAttempt = now;
    return { success: true };
}
