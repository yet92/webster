import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Line, LineConfig } from "konva/lib/shapes/Line";
import useItem from "./useItem";
import { nanoid } from "nanoid";
import { decimalUpToSeven } from "../util/decimalUpToSeven";
import { useSelector } from "react-redux";
import { StoreState } from "../redux/store";

const useBrush = (stageRef: React.RefObject<Stage>) => {
  const { currentTool, brushOptions, toolColor } = useSelector(
    (state: StoreState) => state.toolSelection
  );
  const { brushSize, brushOpacity } = brushOptions;

  const { createItem } = useItem();
  const isDrawingRef = useRef(false);
  const linesRef = useRef<Line[]>([]);

  useEffect(() => {
    if (currentTool === "brush" || currentTool == "eraser") {
      const stage = stageRef.current!;
      const layer = new Layer();
      stage.add(layer);

      const handleMouseDown = () => {
        isDrawingRef.current = true;
        const pos = stage.getPointerPosition();
        const stageOrigin = stage.getAbsolutePosition();

        const newLine = new Konva.Line({
          stroke: toolColor,
          strokeWidth: brushSize,
          lineCap: "round",
          lineJoin: "miter",
          globalCompositeOperation:
            currentTool == "eraser" ? "destination-out" : "source-over",
          points: [
            decimalUpToSeven((pos!.x - stageOrigin.x) / stage.scaleX()),
            decimalUpToSeven((pos!.y - stageOrigin.y) / stage.scaleY()),
          ],
          draggable: false,
          opacity: brushOpacity,
        });

        // change to current layer
        layer.add(newLine);

        linesRef.current.push(newLine);
      };

      const handleMouseUp = () => {
        isDrawingRef.current = false;
        const lastLine = linesRef.current[linesRef.current.length - 1];
        createItem({
          id: nanoid(),
          attrs: {
            ...lastLine.attrs,
            updatedAt: Date.now(),
            "data-item-type": "line",
            name: "label-target",
          },
          className: "brush-line",
          children: [],
        });
        layer.destroyChildren();
      };
      const handleMouseMove = () => {
        if (!isDrawingRef.current) {
          return;
        }
        const pos = stage.getPointerPosition();
        const stageOrigin = stage.getAbsolutePosition();

        const lastLine = linesRef.current[linesRef.current.length - 1];
        const newPoints = lastLine
          .points()
          .concat([
            decimalUpToSeven((pos!.x - stageOrigin.x) / stage.scaleX()),
            decimalUpToSeven((pos!.y - stageOrigin.y) / stage.scaleY()),
          ]);
        lastLine.points(newPoints);
        layer.batchDraw();
      };

      stage.on("mousedown touchstart", handleMouseDown);
      stage.on("mouseup touchend", handleMouseUp);
      stage.on("mousemove touchmove", handleMouseMove);

      return () => {
        stage.off("mousedown touchstart", handleMouseDown);
        stage.off("mouseup touchend", handleMouseUp);
        stage.off("mousemove touchmove", handleMouseMove);
        layer.destroy();
      };
    }
  }, [stageRef, toolColor, brushSize, brushOpacity, currentTool]);

  return {};
};

export default useBrush;
