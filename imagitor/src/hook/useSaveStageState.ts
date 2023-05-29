import { useDispatch, useSelector } from "react-redux";
import {
  StageDataListItem,
  stageDataListSelector,
} from "../redux/StageDataList";
import { useParams } from "react-router-dom";
import { StoreState } from "../redux/store";
import { useState } from "react";
import { setCurrent } from "../redux/pageSlice";
import { constants } from "../util/constants";

const SERVER_URL = constants.SERVER_URL;

export const useSaveStageState = () => {

  const [loading, setLoading] = useState(false);

  const auth = useSelector((state: StoreState) => state.auth);
  const dispatch = useDispatch();

  const stageDataList = useSelector(stageDataListSelector.selectAll);

  const saveStageToLocalStorage = () => {
    localStorage.setItem("StageDataList", JSON.stringify(stageDataList));
  };

  const getStageFromLocalStorage = (): StageDataListItem[] => {
    
    return JSON.parse(localStorage.getItem("StageDataList") || "[]");
  };

  const getStageFromServer = async (projectId: number): Promise<StageDataListItem[]> => {

    setLoading(true);
    if (auth.me.accessToken) {

      dispatch(setCurrent(projectId));

      const response = await fetch(`${SERVER_URL}/api/projects/${projectId}`,
        {
          headers: {
            "Authorization": `Bearer ${auth.me.accessToken}`
          }
        });

      const json = await response.json();

      if (response.ok) {
        const projectString = json.data.project;
        const project = JSON.parse(projectString);
        return project;
      }
    }

    setLoading(false);

    return [];
  };

  // const saveStageToServer = async () => {}

  return {
    saveStageToLocalStorage,
    getStageFromLocalStorage,
    getStageFromServer,
    loading,
  };
};
