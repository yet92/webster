/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useDispatch, useSelector } from "react-redux"
import { Errors, LoginForm } from "./components"
import { FormData } from "./components/LoginForm"
import { RequestType, authFetch } from "./utils/auth"
import { RootState } from "../../store"
import { addError, clearErrors } from "../../store/errorsSlice"
import { login } from "../../store/authSlice"

export default function LoginPage() {

    const dispatch = useDispatch();

    const onFormData = async (formData: FormData) => {
        dispatch(clearErrors());

        // @ts-ignore
        const { response, json } = await authFetch(RequestType.Login, formData);

        if (!response.ok) {
            // add error
            dispatch(addError({ message: json.message }));
        } else {
            const user = { me: json.data.user, accessToken: json.data.token };
            // @ts-ignore
            dispatch(login(user));
        }

    }

    return (
        <div className="flex flex-col justify-center items-center gap-10">
            <LoginForm {...{ onFormData }}></LoginForm>
        </div>
    )
}