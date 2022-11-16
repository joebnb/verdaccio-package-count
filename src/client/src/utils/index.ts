export * from './cache';
export * from './package';
export * from './version-repace';

export function getDiffFromDate(date1: Date, date2: Date) {
    const delta = Math.abs(date1.getTime() - date2.getTime());
    const deltaSeconds = delta / 1000;
    const deltaMinute = deltaSeconds / 60;
    const deltaHour = deltaMinute / 60;
    const deltaDay = deltaHour / 24;
    return Math.floor(deltaDay || 0);
}
