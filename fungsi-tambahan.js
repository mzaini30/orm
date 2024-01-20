export function getRandomFourDigitNumber() {
    const min = 1000; // Angka terkecil dengan 4 digit
    const max = 9999; // Angka terbesar dengan 4 digit
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function buatId() {
    let teksnya = Date.now() + '' + getRandomFourDigitNumber();
    return Number(teksnya);
}