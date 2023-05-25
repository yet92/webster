
import { LoginForm } from "./components"
import loginImage from '../../../public/LoginImage.jpg';

export default function LoginPage() {
    return (
        <div className="flex justify-center gap-10">
            <LoginForm></LoginForm>
            <div className="basis-1/3 m-10">
                <img className="rounded-xl " src={loginImage} ></img>
            </div>
        </div>
    )
}