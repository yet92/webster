import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "../../../utils/constants";
import { login } from "../../../store/authSlice";

export default function GoogleButton() {

    const dispatch = useDispatch();

    const onGoogleAuthSuccess = async (
        credentialResponse: CredentialResponse
    ) => {

        const res = await fetch(`${SERVER_URL}/api/auth/google/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const json = await res.json();
        console.table(json);

        const user = { me: json.data.user, accessToken: json.data.token };
        dispatch(login(user));
        // auth login
    };

    return (
        <GoogleLogin
            onSuccess={onGoogleAuthSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
            size="medium"
            width="10px"
            useOneTap={true}
            auto_select={false}
            theme="filled_blue"
            text="continue_with"
        />
    )

}