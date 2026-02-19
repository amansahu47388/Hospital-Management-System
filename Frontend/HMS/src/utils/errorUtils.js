/**
 * Extracts a user-friendly error message from a backend error response.
 * @param {Object} err - The error object from axios/api call.
 * @param {string} defaultMsg - Default message if extraction fails.
 * @returns {string} - The extracted error message.
 */
export const getErrorMessage = (err, defaultMsg = "An unexpected error occurred") => {
    if (!err || !err.response) {
        return err?.message || defaultMsg;
    }

    const data = err.response.data;

    // Handle standardized error_response from backend
    if (data && data.error) {
        return data.error;
    }

    // Handle standard DRF detail messages
    if (data && data.detail) {
        return data.detail;
    }

    // Handle validation errors (objects/arrays)
    if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const error = data[firstKey];

        if (Array.isArray(error)) {
            return `${firstKey}: ${error[0]}`;
        }

        if (typeof error === "string") {
            return error;
        }

        if (typeof error === "object" && error !== null) {
            return getErrorMessage({ response: { data: error } }, defaultMsg);
        }
    }

    return defaultMsg;
};
