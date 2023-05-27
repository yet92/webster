import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToolSelectionState {
  currentTool: "brush" | "pointer" | "bucket" | "eraser";
  brushOptions: BrushOptions;
  toolColor: string;
}

type BrushOptions = {
  brushSize?: number;
  brushOpacity?: number;
  brushTension?: number;
};

const initialState: ToolSelectionState = {
  currentTool: "pointer",
  toolColor: "black",
  brushOptions: {
    brushSize: 5,
    brushOpacity: 1,
    brushTension: 0,
  },
};

const toolSelectionSlice = createSlice({
  name: "toolSelection",
  initialState,
  reducers: {
    setTool: (
      state,
      action: PayloadAction<"brush" | "pointer" | "bucket" | "eraser">
    ) => {
      state.currentTool = action.payload;
    },
    setBrushOptions: (state, action: PayloadAction<BrushOptions>) => {
      state.brushOptions = { ...state.brushOptions, ...action.payload };
    },
    setToolColor: (state, action: PayloadAction<string>) => {
      state.toolColor = action.payload;
    },
  },
});

export const { setTool, setBrushOptions, setToolColor } = toolSelectionSlice.actions;

export default toolSelectionSlice.reducer;

export type { ToolSelectionState };
