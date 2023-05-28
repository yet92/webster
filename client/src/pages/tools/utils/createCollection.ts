import { SERVER_URL } from '../../../utils/constants';
import { FormData } from '../components/CreateCollectionForm';
import { IResponseWithData } from '../../../utils';

export async function createFetch(data: FormData, token: string) {
  const endpoint = `${SERVER_URL}/api/collections/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  const json: IResponseWithData<{
    collection: { id: number; title: string; thumbnail: string };
  }> = await response.json();
  return { response, json };
}
