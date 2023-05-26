import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { setBrushOptions } from "../redux/selectTool";
import { Form } from "react-bootstrap";
import { StoreState } from "../redux/store";
const BrushDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const { brushOptions, toolColor } = useSelector(
    (state: StoreState) => state.toolSelection
  );

  const onOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBrushOptions({ [e.target.name]: parseFloat(e.target.value) }));
  };
  return (
    <>
      <div
        className="brush-slider-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          className="brush-size-circle"
          style={{
            width: brushOptions.brushSize,
            height: brushOptions.brushSize,
            opacity: brushOptions.brushOpacity,
            backgroundColor: toolColor,
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "50%",
          }}
        ></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Brush Size</span>
          <input
            style={{ width: "100%" }}
            placeholder="Size"
            type="number"
            name="brushSize"
            onChange={onOptionsChange}
          />
          <Form.Range
            value={brushOptions.brushSize}
            min={1}
            max={100}
            step={1}
            name="brushSize"
            onChange={onOptionsChange}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Brush Opacity</span>
          <Form.Range
            value={brushOptions.brushOpacity}
            min={0}
            max={1}
            step={0.1}
            name="brushOpacity"
            onChange={onOptionsChange}
          />
          <input
            style={{ width: "100%" }}
            placeholder="Opacity"
            type="number"
            name="brushOpacity"
            onChange={onOptionsChange}
          />
        </div>
      </div>
    </>
  );
};

export default BrushDropdown;
