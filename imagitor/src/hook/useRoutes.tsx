/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import { Transformer } from "react-konva";
import { Route, Routes, useParams } from "react-router-dom";
import header from "../header";
import Layout from "../layout";
import navBar from "../navBar";
import settingBar from "../settingBar";
import View from "../view";
import { loadUserWithToken } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Authorize = () => {

  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      console.log(token);
      // @ts-ignore
      dispatch(loadUserWithToken(token));
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

// @ts-ignore
const useRoutes = ({ header, navBar, settingBar, hotkeyModal, onSelectItem, stage, stageData, transformer, renderObject }, isAuthorized = false) => {
  if (!isAuthorized) {
    return (
      <Routes>
        <Route path="authorize">
          <Route path=":token" element={<Authorize></Authorize>}></Route>
        </Route>
        <Route path="*" element={<Layout header={header} navBar={navBar} settingBar={settingBar}>
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
  }
};

export default useRoutes;