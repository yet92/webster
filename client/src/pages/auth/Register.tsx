import { useDispatch } from "react-redux";
import { addError, clearErrors } from "../../store/errorsSlice";
import { Errors, RegisterForm } from "./components";
import { FormData } from "./components/RegisterForm";
import { RequestType, authFetch } from "./utils/auth";

export default function RegisterPage() {

    const dispatch = useDispatch();

    const onFormData = async (formData: FormData) => {
        dispatch(clearErrors());

        const { response, json } = await authFetch(RequestType.Register, formData);

        if (!response.ok) {
            // add error
            dispatch(addError({ message: json.message }));
        }

    }

    return (
        <div className="flex flex-col justify-center gap-10 items-center">
            <RegisterForm {...{ onFormData }}></RegisterForm>
        </div>
    )
}
