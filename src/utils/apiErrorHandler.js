export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || 'An error occurred';
    const status = error.response.status;
    return { message, status };
  } else if (error.request) {
    // Request made but no response
    return { message: 'No response from server', status: 503 };
  } else {
    // Error setting up request
    return { message: error.message, status: 500 };
  }
};
