import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import WindowState, { WindowTemplate } from '../window/Window.props';

export const windowsSlice = createSlice({
  name: 'windows',
  initialState: {
    nextWindowId: 0,
    windows: [] as WindowState[]
  },
  reducers: {
    createWindow: (state, action: PayloadAction<WindowTemplate>) => {
      const newWindow = {
        id: state.nextWindowId,
        ...action.payload,
        top: action.payload.top || 100,
        left: action.payload.left || 100
      };

      state.windows.push(newWindow);
      state.nextWindowId++;
    },
    destroyWindow: (state, action: PayloadAction<number>) => {
      state.windows = state.windows
        .filter(win => win.id !== action.payload);
    }
  }
});

export const { createWindow, destroyWindow } = windowsSlice.actions;

export default windowsSlice.reducer;

export const selectWindows = (state: RootState) => state.windows;