let utility = {};

utility.getErrorMessage = (error) => {
    let response = error.response || {};
    let data = response.data || {};
    return data.message || error.message || 'An unknown error occurred.';
};

export default utility;