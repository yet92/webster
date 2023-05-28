import { SERVER_URL } from '../../../utils/constants';

export async function changeIsPublic(
  id: number,
  token: string,
  isPublic: boolean
) {
  const endpoint = `${SERVER_URL}/api/projects/${id}`;

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isPublic }),
  });

  return { response };
}
