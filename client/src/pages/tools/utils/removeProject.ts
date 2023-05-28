import { SERVER_URL } from '../../../utils/constants';
import { FormData } from '../components/CreateProjectModal';
import { IResponse, IResponseWithData } from '../../../utils';

export async function removeFetch(id: string, token: string) {
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
