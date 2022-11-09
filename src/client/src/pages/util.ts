export function getWeekIndex(dateTime: number = Date.now()) {
    const firstDayOfYear = new Date(dateTime, 0, 1).getTime();
    const msCount = dateTime - firstDayOfYear;
    const dayCount = Math.ceil(msCount / 86400000);
    return Math.ceil(dayCount / 7);
}
