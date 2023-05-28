import { SERVER_URL } from '../../../utils/constants';
import { IResponseWithData } from '../../../utils';
import { User } from '../../../store/authSlice';

export async function fetchAllUsers() {
  const endpoint = `${SERVER_URL}/api/users/`;
  const response = await fetch(endpoint, {
    method: 'GET',
  });

  const json: IResponseWithData<{projects: User[]}> = await response.json();
  return { response, json };
}

export async function fetchOneUser(userId: string) {
  const endpoint = `${SERVER_URL}/api/users/${userId}`;
  const response = await fetch(endpoint, {
    method: 'GET',
  });

  const json: IResponseWithData<{user: User}> = await response.json();
  return { response, json };
}