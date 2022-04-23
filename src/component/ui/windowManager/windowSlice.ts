import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import WindowState, { WindowTemplate } from '../window/Window.props';

export const windowsSlice = createSlice({
  name: 'windows',
  initialState: {
    nextWindowId: 0,
    nextWindowPosition: {
      x: 100,
      y: 100
    },
    windows: [] as WindowState[]
  },
  reducers: {
    createWindow: (state, action: PayloadAction<WindowTemplate>) => {
      const { x, y } = state.nextWindowPosition;
      const maxZIndex = state.windows
        .map(win => win.zIndex)
        .reduce((acc, val) => Math.max(acc, val), 0);

      const newWindow = {
        id: state.nextWindowId,
        ...action.payload,
        top: action.payload.top || y,
        left: action.payload.left || x,
        zIndex: maxZIndex + 1,
        active: true
      };

      state.nextWindowPosition = {
        x: (x - 50) % 400 + 100,
        y: (y - 50) % 300 + 100
      };

      state.windows.forEach(win => win.active = false);
      state.windows.push(newWindow);
      state.nextWindowId++;
    },

    focusWindow: (state, action: PayloadAction<number>) => {
      const focused = state.windows
        .find(win => win.id === action.payload);
      
      if (!focused) return;

      const pivot = focused.zIndex;
      const maxZIndex = state.windows
        .map(win => win.zIndex)
        .reduce((acc, val) => Math.max(acc, val), 0);

      // Lower the z-index of all windows above current
      state.windows
        .filter(win => win.zIndex > pivot)
        .forEach(win => win.zIndex = win.zIndex - 1);

      focused.zIndex = maxZIndex; // And float this one to the top

      // Finally, set active for all windows
      state.windows
        .forEach(win => win.active = (win.id === focused.id));
    },

    destroyWindow: (state, action: PayloadAction<number>) => {
      state.windows = state.windows
        .filter(win => win.id !== action.payload);
    },

    setWindowTitle: (state, action: PayloadAction<{ windowId: number, title: string }>) => {
      const window = state.windows
        .find(win => win.id === action.payload.windowId);

      if (window) window.title = action.payload.title;
    }
  }
});

export const { createWindow, focusWindow, destroyWindow, setWindowTitle } = windowsSlice.actions;

export default windowsSlice.reducer;

export const selectWindows = (state: RootState) => state.windows;
export const selectActiveWindow = (state: RootState) => state.windows
  .windows
  .find(win => win.active === true);