import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { setBrushOptions } from "../redux/selectTool";
import RangeSlider from "react-bootstrap-range-slider";
import { Form } from "react-bootstrap";
import { StoreState } from "../redux/store";
const BrushDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const { brushOptions, toolColor, currentTool } = useSelector((state: StoreState) => state.toolSelection);

  const onSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBrushOptions({ brushSize: parseFloat(e.target.value) }));
  };
  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBrushOptions({ brushOpacity: parseFloat(e.target.value) }));
  };
  return (
    <>
      <div className="tw-z-50 tw-flex tw-w-[15vw] tw-flex-col tw-items-center tw-gap-2 tw-p-2 tw-text-text">
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-2 ">
          <span className="tw-capitalize">{currentTool} Size</span>
          <input
            style={{ width: "100%" }}
            placeholder="Size"
            type="number"
            name="brushSize"
            step={1}
            max={100}
            min={1}
            className={`tw-bg-tr tw-w-full tw-cursor-default tw-border-x-0 tw-border-t-0  tw-border-b-contrast tw-bg-secondary tw-text-text tw-outline-none`} //tw-caret-transparent
            onChange={onSizeChange}
          />
          <RangeSlider
            className="tw-w-full"
            value={brushOptions.brushSize as number}
            min={1}
            max={100}
            step={1}
            onChange={onSizeChange}
          />
        </div>
        {currentTool === "brush" && (
          <div className="tw-flex tw-w-full tw-flex-col tw-gap-2">
            <span>Brush Opacity</span>
            <input
              style={{ width: "100%" }}
              placeholder="Opacity"
              type="number"
              name="brushSize"
              className={`tw-bg-tr tw-w-full tw-cursor-default tw-border-x-0 tw-border-t-0  tw-border-b-contrast tw-bg-secondary tw-text-text tw-outline-none`} //tw-caret-transparent
              step={0.1}
              max={1}
              min={0}
              onChange={onOpacityChange}
            />
            <RangeSlider
              className="tw-w-full"
              value={brushOptions.brushOpacity as number}
              min={0}
              max={1}
              step={0.1}
              onChange={onOpacityChange}
            />
          </div>
        )}
        {currentTool === "brush" && (
          <div
            className="tw-self-center tw-shadow-2xl tw-shadow-contrast/50"
            style={{
              width: brushOptions.brushSize,
              height: brushOptions.brushSize,
              opacity: brushOptions.brushOpacity,
              backgroundColor: toolColor,
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "50%",
            }}
          ></div>
        )}
      </div>
    </>
  );
};

export default BrushDropdown;
