export const formatDatetime = (utcDateTimeString) => {
    const localDateTime = new Date(utcDateTimeString);

    const day = String(localDateTime.getDate()).padStart(2, '0');
    const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
    const year = localDateTime.getFullYear();

    const hours = String(localDateTime.getHours()).padStart(2, '0');
    const minutes = String(localDateTime.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export const formatDate = (utcDateTimeString) => {
    const localDateTime = new Date(utcDateTimeString);

    const day = String(localDateTime.getDate()).padStart(2, '0');
    const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
    const year = localDateTime.getFullYear();

    return `${day}.${month}.${year}`;
};

export const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) 
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    return `${m}:${s.toString().padStart(2, "0")}`;
};