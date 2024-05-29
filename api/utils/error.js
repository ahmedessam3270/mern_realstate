export const errorHandler = (statusCode, message) => {
  // create an error using error constructor func.
  const error = new Error();

  // we assign the status code argument to the newly created error
  error.statusCode = statusCode;

  // we assign the given message argument to be the message of the error;
  error.message = message;

  // we return the error to the next middleware
  return error;
};
