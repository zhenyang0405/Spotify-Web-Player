export function extractYear(date) {
    let arr = date.split('-');
    let year = arr[0];

    return year;
}

export function extractMonth(date) {
    let arr = date.split('-');
    let month = arr[1];

    return month;
}

export function extractDay(date) {
    let arr = date.split('-');
    let day = arr[2];

    return day;
}