const dateFormat = require('dateformat');

// const dateFormat = require('dateformat');

// export function parseDate(dateString: String) : Date {
//     return dateFormat(dateString, "yyyy-mm-dd'T'HH:MM:ssZ");
// }

// export function getDate() {
//     return Date.now();
// }

export function getExactTime(date: Date) {
    const exactTime = dateFormat(
        date,
        "yyyy-mm-dd'T'HH:MM:ssZ"
    );

    return exactTime;
}