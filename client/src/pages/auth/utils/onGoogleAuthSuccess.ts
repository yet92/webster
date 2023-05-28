import { CredentialResponse } from '@react-oauth/google';
import { SERVER_URL } from '../../../utils/constants';

export const onGoogleAuthSuccess = async (
  credentialResponse: CredentialResponse
) => {

  const res = await fetch(`${SERVER_URL}/api/auth/google/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential: credentialResponse.credential }),
  });
  const json = await res.json();
  console.table(json);
  // auth login
};
