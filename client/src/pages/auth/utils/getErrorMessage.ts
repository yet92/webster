import { ClientError } from '../../../store/errorsSlice';

export const getErrorMessage = (error: ClientError) => {
  if (error.message === 'incorrect repeatPassword.') {
    return 'Passwords do not match';
  }
  const firstLetter = error.message.charAt(0);

  return firstLetter.toUpperCase() + error.message.slice(1);
};
