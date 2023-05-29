import { SERVER_URL } from '../../../utils/constants';
import { IResponseWithData } from '../../../utils';
import { Project } from '../../../store/projectsSlice';

export async function fetchAllProjects(token: string) {
  const endpoint = `${SERVER_URL}/api/projects/`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json: IResponseWithData<{ projects: Project[] }> =
    await response.json();
  return { response, json };
}

export async function addToCollection(
  token: string,
  collectionId: number,
  projectId: number
) {
  const endpoint = `${SERVER_URL}/api/projects/${projectId}/collection`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ collectionId }),
  });

  const json: IResponseWithData<{ projects: Project }> =
    await response.json();
  return { response, json };
}

export async function removeFromCollection(
  token: string,
  projectId: number
) {
  const endpoint = `${SERVER_URL}/api/projects/${projectId}/collection`;
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json: IResponseWithData<{ projects: Project }> =
    await response.json();
  return { response, json };
}

export async function fetchOneProject(token: string, projectId: string) {
  const endpoint = `${SERVER_URL}/api/projects/${projectId}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json: IResponseWithData<{ project: Project }> = await response.json();
  return { response, json };
}
