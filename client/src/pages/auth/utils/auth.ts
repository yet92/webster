import { SERVER_URL } from '../../../utils/constants';
import { FormData as RegisterFormData } from '../components/RegisterForm';
import { FormData as LoginFormData } from '../components/RegisterForm';
import { IResponse, IResponseWithData } from '../../../utils';

export enum RequestType {
  Register,
  Login,
}

export type FormData = LoginFormData | RegisterFormData;

export async function authFetch(type: RequestType, data: FormData) {
  let endpoint = `${SERVER_URL}/api/auth/credentials/`;

  switch (type) {
    case RequestType.Login:
      endpoint += 'login';
      break;
    case RequestType.Register:
      endpoint += 'signup';
      break;
  }
  console.log(endpoint);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json: IResponseWithData<{
    user: { id: number; email: string; username: string };
    token: string;
  }> = await response.json();

  return { response, json };
}
