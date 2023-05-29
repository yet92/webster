/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import { Transformer } from "react-konva";
import { useDispatch } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";
import Layout from "../layout";
import { loadUserWithToken, logout } from "../redux/authSlice";
import View from "../view";

const Authorize = () => {

  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      console.log(token);
      // @ts-ignore
      dispatch(loadUserWithToken(token));
      setTimeout(() => {
        window.close();
      }, 1000);
    }
    // save to redux
    // close window
  }, []);

  return (
    <div>
      Authorization
    </div>
  );
};

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <div>Logout</div>
  );
};

// @ts-ignore
const useRoutes = ({ header, navBar, settingBar, hotkeyModal, onSelectItem, stage, stageData, transformer, renderObject }, isAuthorized = false) => {
  return (
    <Routes>
      {
        !isAuthorized
        && <Route path="authorize">
          <Route path=":token" element={<Authorize></Authorize>}></Route>
        </Route>
      }

      {
        isAuthorized
        && <Route path="logout" element={<Logout />}></Route>
      }

      <Route path="/project/:projectId" element={<Layout header={header} navBar={navBar} settingBar={settingBar}>
        {hotkeyModal}
        <View onSelect={onSelectItem} stage={stage}>

          {
            // @ts-ignore
            stageData.length ? stageData.map((item) => renderObject(item)) : null}
          <Transformer
            ref={transformer.transformerRef}
            keepRatio
            shouldOverdrawWholeArea
            boundBoxFunc={(_, newBox) => newBox}
            onTransformEnd={transformer.onTransformEnd}
          />
        </View>
      </Layout>}
      ></Route>
    </Routes>
  );
};

export default useRoutes;