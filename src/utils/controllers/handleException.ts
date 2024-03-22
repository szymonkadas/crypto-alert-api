import { HttpException, InternalServerErrorException } from '@nestjs/common';

// Handles exceptions according to their type.
export default function handleException<t extends HttpException | Error>(
  error: t,
) {
  if (error instanceof HttpException) {
    return error;
  }
  return new InternalServerErrorException(
    // not sure if i should pass such error here to the user?
    error,
    error.message || 'Internal server error',
  );
}
