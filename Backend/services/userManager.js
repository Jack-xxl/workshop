const usageLogs = {};

function checkUserAccess(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const key = `${userId}_${today}`;
    if (!usageLogs[key]) usageLogs[key] = 0;
    if (usageLogs[key] >= 3) {
        return { allowed: false, message: '今日已达上限' };
    }
    return { allowed: true };
}

function recordUsage(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const key = `${userId}_${today}`;
    usageLogs[key] = (usageLogs[key] || 0) + 1;
}

module.exports = {
    checkUserAccess,
    recordUsage,
};