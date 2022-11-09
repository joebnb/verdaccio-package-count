export function getWeekIndex(dateTime: number = Date.now()) {
    let d1: any = new Date(dateTime);
    let d2: any = new Date(dateTime);
    d2.setMonth(0);
    d2.setDate(1);
    let rq = d1 - d2;
    let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
    let num = Math.ceil(days / 7);
    return num + 1;
}
