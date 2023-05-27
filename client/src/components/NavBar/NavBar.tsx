import { Button, Navbar } from "flowbite-react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { logout } from "../../store/authSlice";
import { MouseEventHandler } from "react";

export function NavBar() {

    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    const onLogoutClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        dispatch(logout());
    }

    const showSignLinks = () => {
        if (auth.isAuthenticated) {
            // return logout
            return (
                <Button onClick={onLogoutClick}>Logout</Button>
            );
        } else {
            return (
                <>
                    <Navbar.Link active href="/auth/login">
                        Login
                    </Navbar.Link>
                    <Navbar.Link active href="/auth/register">
                        Register
                    </Navbar.Link>
                </>
            )
        }
    }

    return (
        <Navbar fluid rounded>

            <Navbar.Collapse>
                {showSignLinks()}
            </Navbar.Collapse>

        </Navbar>
    )
}