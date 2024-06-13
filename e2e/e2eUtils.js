export function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return (dd < 10 ? `0${dd}`: dd) + '/' + (mm < 10 ? `0${mm}`: mm) + '/' + yyyy;
}

export function getTomorrowDate() {
    const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const dd = currentDate.getDate();
    const mm = currentDate.getMonth() + 1;
    const yyyy = currentDate.getFullYear();

    return (dd < 10 ? `0${dd}`: dd) + '/' + (mm < 10 ? `0${mm}`: mm) + '/' + yyyy;
}