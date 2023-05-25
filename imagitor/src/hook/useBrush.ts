import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Line, LineConfig } from "konva/lib/shapes/Line";
import useItem from "./useItem";
import { nanoid } from "nanoid";

interface BrushOptions {
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
}

interface KonvaLineState {
  stroke: string;
  strokeWidth: number;
  globalCompositeOperation: string;
  points: number[];
  draggable: boolean;
  opacity: number;
}

const useBrush = (stageRef: React.RefObject<Stage>, options: BrushOptions) => {
  const { brushColor, brushSize, brushOpacity } = options;
  const { createItem } = useItem();
  const isDrawingRef = useRef(false);
  const linesRef = useRef<Line[]>([]);
  console.log(stageRef.current?.getLayers());
  useEffect(() => {
    const stage = stageRef.current!;
    const layer = new Layer();
    stage.add(layer);

    const handleMouseDown = () => {
      isDrawingRef.current = true;
      const pos = stage.getPointerPosition();
      const newLine = new Konva.Line({
        stroke: brushColor,
        strokeWidth: brushSize,
        globalCompositeOperation: "source-over",
        points: [pos!.x, pos!.y],
        draggable: false,
        opacity: brushOpacity,
      });
      stageRef.current?.getLayers()[1].add(newLine);

      linesRef.current.push(newLine);
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
      const lastLine = linesRef.current[linesRef.current.length - 1];
      createItem({
        id: nanoid(),
        attrs: { ...lastLine.attrs, "data-item-type": "line" },
        className: "brush-line",
      });
    };

    const handleMouseMove = () => {
      if (!isDrawingRef.current) {
        return;
      }
      const pos = stage.getPointerPosition();
      const lastLine = linesRef.current[linesRef.current.length - 1];
      const newPoints = lastLine.points().concat([pos!.x, pos!.y]);
      lastLine.points(newPoints);

      // Create a new line object with the updated points
      const updatedLine = new Konva.Line(lastLine.attrs);

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
  }, [stageRef, brushColor, brushSize, brushOpacity]);

  return {};
};

export default useBrush;
