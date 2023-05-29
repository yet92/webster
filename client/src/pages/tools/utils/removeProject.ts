import { SERVER_URL } from '../../../utils/constants';

export async function removeFetch(id: number, token: string) {
  const endpoint = `${SERVER_URL}/api/projects/${id}`;

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return { response };
}
