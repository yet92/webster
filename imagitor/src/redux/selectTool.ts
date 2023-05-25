import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToolSelectionState {
  currentTool: "brush" | "pointer" | "bucket" | "eraser";
}

const initialState: ToolSelectionState = {
  currentTool: "brush",
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
  },
});

export const { setTool } = toolSelectionSlice.actions;

export default toolSelectionSlice.reducer;

export type { ToolSelectionState };
