import { useSelector } from "react-redux";
import { StageDataListItem, stageDataListSelector } from "../redux/StageDataList";

export const useSaveStageState = () => {
  const stageDataList = useSelector(stageDataListSelector.selectAll);

  const saveStageToLocalStorage = () => {
    console.log("Stage", stageDataList);
    localStorage.setItem("StageDataList", JSON.stringify(stageDataList));
  };

  const getStageFromLocalStorage = () : StageDataListItem[] => {
    return JSON.parse(localStorage.getItem("StageDataList") || "[]");
  };

  return {
    saveStageToLocalStorage,
    getStageFromLocalStorage,
  };
};
