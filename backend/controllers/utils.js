
export function isStringNotEmpty(str) {
    return str.trim() !== "";
}

export const isUserIdValid = (str) => {
    
    return str.toString().match("^\\d{7}$|^\\d{9}$") !== null;
}
