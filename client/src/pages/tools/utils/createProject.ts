import { IResponseWithData } from '../../../utils';
import { SERVER_URL } from '../../../utils/constants';
import { FormData } from '../components/CreateProjectModal';

export async function createFetch(data: FormData, token: string) {
  const endpoint = `${SERVER_URL}/api/projects/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ ...data, project: `[{"id":"${data.title}","data":[]}]` }),
  });

  const json: IResponseWithData<{
    project: { id: number; title: string; project: string; thumbnail: string };
  }> = await response.json();

  return { response, json };
}
