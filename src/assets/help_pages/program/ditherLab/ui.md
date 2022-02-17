# The DitherLab User Interface

The DitherLab UI consists of four main parts: the control bar, the view area, the tool pane, and the status bar.

## Control bar

The control bar is the horizontal bar at the top. It contains DitherLab's basic controls: saving a render result, controlling the view, and rendering a dithered image.

### Live Render

When the "Live Render" box is checked, the image will be automatically rendered whenever settings are changed. Uncheck it if you have a slow GPU and the application becomes unresponsive. Live Render is disabled for processes running on the CPU (Software). 

## View area

The view area is where you'll see the dithered image once rendered. If the image is larger than the viewport, you can move around using the scrollbars or by panning with the mouse. You can zoom in and out with the view controls in the control bar.

## Tool pane

The tool pane to the right of the view area is where most of DitherLab's interaction happens. In it, you will find panels containing the various settings you can adjust to control the dithering process. Each setting is explained in detail in the [DitherLab Settings](help/programs/dlab/settings) section.

Setting panels can be collapsed and expanded by clicking on their title bars. Collapsed panels will show an arrow pointing down [↓] at the top right corner. Expanded panels will show an arrow pointing up [↑].

## Status bar

The status bar can be found at the bottom of the DitherLab window. It displays useful information like the program status, how long the last render took and the actual render resolution.