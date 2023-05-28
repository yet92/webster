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

  const json: IResponseWithData<{projects: Project[]}> = await response.json();
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

  const json: IResponseWithData<{projects: Project[]}> = await response.json();
  return { response, json };
}