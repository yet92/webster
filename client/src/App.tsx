import useRoutes from "./routes";
import { BrowserRouter } from 'react-router-dom';
import { NavBar, PageFooter } from "./components";

import './index.css';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { loadUser } from './store/authSlice';
import { Spinner } from "flowbite-react";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const routes = useRoutes();

  useEffect(() => {
    dispatch(loadUser());
    console.log(auth.me);
  }, [])

  return (
    <GoogleOAuthProvider clientId="1059652328927-dq16tfcjpte6ruu8al8fvg2qhqsgim7m.apps.googleusercontent.com">
      <div className="dark min-h-screen">
        {
          auth.loading ?
            (
              <div className="flex min-h-screen justify-center items-center">
                <Spinner aria-label="Default status example" />
              </div>

            )
            :
            (
              <>
                <BrowserRouter>
                <NavBar/>
                  {routes}
                </BrowserRouter>
                <PageFooter />
              </>
            )
        }

      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
