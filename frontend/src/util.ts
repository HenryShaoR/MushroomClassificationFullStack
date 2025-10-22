export const normalize = (str: string) => {
    return str
        .replaceAll('-', ' ')
        .split(' ') // Split the string into words by spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter and lowercase the rest
        .join(' '); // Join the words back together with a space
};
