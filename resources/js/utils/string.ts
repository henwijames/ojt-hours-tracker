export const truncateText = (text: string, maxLength = 10) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
};

export const acronymText = (text: string) => {
    const acronym = text
        .split('')
        .filter((char) => char === char.toUpperCase() && /[A-Z]/.test(char))
        .join('');

    return acronym;
};
