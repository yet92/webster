import { Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "./pages/auth";

export type PageDesc = {
    path: string,
    page?: React.FC | null,
    pages?: PageDesc[]
}

export default function useRoutes(authenticated = false) {

    return (
        <Routes>

            <Route path="/auth">
                <Route path="login" element={<LoginPage />}>
                </Route>
                <Route path="register" element={<RegisterPage />}></Route>
            </Route>

        </Routes >
    )
}