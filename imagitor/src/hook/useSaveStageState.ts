import { useDispatch, useSelector } from "react-redux";
import {
  StageDataListItem,
  stageDataListSelector,
} from "../redux/StageDataList";
import { useParams } from "react-router-dom";
import { StoreState } from "../redux/store";
import { useState } from "react";
import { setCurrent } from "../redux/pageSlice";

const SERVER_URL = "http://localhost:4000";

export const useSaveStageState = () => {

  const [loading, setLoading] = useState(false);

  const auth = useSelector((state: StoreState) => state.auth);
  const dispatch = useDispatch();

  const stageDataList = useSelector(stageDataListSelector.selectAll);

  const saveStageToLocalStorage = () => {
    console.log("Stage", stageDataList);
    localStorage.setItem("StageDataList", JSON.stringify(stageDataList));
  };

  const getStageFromLocalStorage = (): StageDataListItem[] => {
    
    return JSON.parse(localStorage.getItem("StageDataList") || "[]");
  };

  const getStageFromServer = async (projectId: number): Promise<StageDataListItem[]> => {

    setLoading(true);
    console.log("Load from server");
    console.log("Me: ", auth.me);
    if (auth.me.accessToken) {

      dispatch(setCurrent(projectId));

      const response = await fetch(`${SERVER_URL}/api/projects/${projectId}`,
        {
          headers: {
            "Authorization": `Bearer ${auth.me.accessToken}`
          }
        });

      const json = await response.json();
      console.log("PROJECT: ", json);

      if (response.ok) {
        const projectString = json.data.project;
        const project = JSON.parse(projectString);
        
        console.log("PROJECT: ", project);

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
