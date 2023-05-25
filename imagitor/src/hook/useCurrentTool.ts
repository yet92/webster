import { useSelector } from "react-redux";
import { StoreState } from "../redux/store";
import { KonvaEventObject } from "konva/lib/Node";
import { StageConfig } from "konva/lib/Stage";
import useBrush from "./useBrush";
import { MutableRefObject } from "react";
import Konva from "konva";

const useCurrentTool = (stageRef: MutableRefObject<Konva.Stage>) => {
  const { currentTool } = useSelector(
    (state: StoreState) => state.toolSelection
  );

  switch (currentTool) {
    case "brush":
      useBrush(stageRef, {
        brushColor: "red",
        brushOpacity: 1,
        brushSize: 5,
      });
  }
};

export default useCurrentTool;
