import { SERVER_URL } from '../../../utils/constants';
import { IResponseWithData } from '../../../utils';
import { Collection } from '../../../store/collectionSlice';

export async function fetchAllCollections(token: string) {
  const endpoint = `${SERVER_URL}/api/collections/`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json: IResponseWithData<{ collections: Collection[] }> =
    await response.json();
  return { response, json };
}

export async function removeCollection(token: string, id: number) {
  const endpoint = `${SERVER_URL}/api/collections/${id}`;
  await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchOneCollection(token: string, collectionId: number) {
  const endpoint = `${SERVER_URL}/api/collections/${collectionId}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json: IResponseWithData<{ collection: Collection }> =
    await response.json();
  return { response, json };
}
