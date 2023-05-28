import {
  configureStore,
  EntityState,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import fileMetaReducer, { FileMeta } from "./fileMeta";
import stageDataReducer, { StageData, stageDataEpic } from "./currentStageData";
import stageDataListReducer, { StageDataListItem } from "./StageDataList";
import imageAssetListReducer, { ImageAssetListItem } from "./imageAssetList";
import toolSelectionReducer, { ToolSelectionState } from "./selectTool";
import authSlice, { userState } from "./authSlice";
import pageSlice, { PageState } from "./pageSlice";

export type StoreState = {
  fileMeta: FileMeta;
  currentStageData: EntityState<StageData["attrs"]>;
  stageDataList: EntityState<StageDataListItem>;
  imageAssetList: EntityState<ImageAssetListItem>;
  toolSelection: ToolSelectionState;
  auth: userState,
  page: PageState,
};

const epicMiddleware = createEpicMiddleware();

const rootEpic = combineEpics(stageDataEpic);

const configureKonvaEditorStore = (preloadedState?: StoreState) => {
  const store = configureStore({
    reducer: {
      fileMeta: fileMetaReducer,
      currentStageData: stageDataReducer,
      stageDataList: stageDataListReducer,
      imageAssetList: imageAssetListReducer,
      toolSelection: toolSelectionReducer,
      auth: authSlice,
      page: pageSlice
    },
    middleware: getDefaultMiddleware({ serializableCheck: false }).concat(
      epicMiddleware
    ),
    preloadedState,
  });
  epicMiddleware.run(rootEpic);
  return store;
};

export default configureKonvaEditorStore;
