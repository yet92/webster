import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_URL } from '../../../utils/constants';
import { login } from '../../../store/authSlice';
import { RootState } from '../../../store/index';

export default function GoogleButton() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((selector: RootState) => selector.auth);
  const onGoogleAuthSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    console.log(credentialResponse);
    const res = await fetch(`${SERVER_URL}/api/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });

    const json = await res.json();
    console.table(json);

    const user = { ...json.data.user, accessToken: json.data.token };
    console.log(user);
    dispatch(login(user));
    // auth login
  };

  return (
    <GoogleLogin
      onSuccess={onGoogleAuthSuccess}
      onError={() => {
        console.log('Login Failed');
      }}
      size='large'
      locale='en'
      width={"350"}
      auto_select={!isAuthenticated}
      useOneTap={!isAuthenticated}
      theme='filled_blue'
      text='continue_with'
    />
  );
}
