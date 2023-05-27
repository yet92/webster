import { Button, Label, TextInput } from "flowbite-react";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import GoogleButton from "./GoogleButton";
import Errors from "./Errors";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { SERVER_URL } from "../../../utils/constants";
import { onGoogleAuthSuccess } from "../utils/onGoogleAuthSuccess";

export type FormData = {
    email: string,
    username: string,
    password: string,
    repeatPassword: string
}

export type Props = {
    onFormData?: (formData: FormData) => void,
}

export default function RegisterForm({ onFormData }: Props) {

    const [formState, setFormState] = useState<FormData>({ email: "", username: "", password: "", repeatPassword: "" });

    const onFormInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormState({ ...formState, [e.target.id]: e.target.value });
    }

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (onFormData) {
            onFormData(formState);
        }
    }

    return (
        <form className="flex flex-col gap-4 w-[40%] justify-center " onSubmit={onSubmit} >

            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="email"
                        value="Your email"
                    />
                </div>
                <TextInput
                    value={formState.email}
                    onChange={onFormInputChange}
                    id="email"
                    type="email"
                    placeholder="name@flowbite.com"
                    required={true}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="email"
                        value="Username"
                    />
                </div>
                <TextInput
                    value={formState.username}
                    onChange={onFormInputChange}
                    id="username"
                    type="text"
                    placeholder=""
                    required={true}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="password1"
                        value="Your password"
                    />
                </div>
                <TextInput
                    value={formState.password}
                    onChange={onFormInputChange}
                    id="password"
                    type="password"
                    required={true}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="repeatPassword"
                        value="Repeat your password"
                    />
                </div>
                <TextInput
                    value={formState.repeatPassword}
                    onChange={onFormInputChange}
                    id="repeatPassword"
                    type="password"
                    required={true}
                />
            </div>
            <Errors></Errors>
            {/* <GoogleButton text="Sign up with google"></GoogleButton> */}
            <div className="flex flex-col items-center gap-5">

                <Button type="submit" className="w-[100%]">
                    Sign up
                </Button>
                <GoogleButton/>
            </div>



        </form >)
}