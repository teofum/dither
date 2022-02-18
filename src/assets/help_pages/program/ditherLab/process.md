# Programs

DitherLab supports many different render processes or programs. Each process is an implementation of a dithering algorithm with configuration options. Different processes will give drastically different results, so be sure to try more than one.

## Render device

DitherLab supports two rendering devices: Software (CPU) and WebGL (GPU). Because implementations, capabilities and limitations differ between devices, most programs support only one device. 

The render device can be changed with the [Device] option in the process settings.

### Software

The Software device uses Web Workers to run intensive rendering programs on the CPU without locking the main UI thread. Software rendering supports using multiple render threads for compatible programs. By default, the software renderer is allowed to use up to half of your CPU's available thread count.

Any dithering algorithm can be implemented in software. However, the software renderer is much slower than hardware-accelerated rendering. For this reason, some programs are not available with software rendering.

### WebGL

The WebGL device runs on the GPU through the WebGL API. Hardware acceleration massively increases performance, enabling features such as live rendering.

While the WebGL device is much faster than software, it has some limitations. Programs are implemented as shaders, which means dithering algorithms must be parallelizable. Some processes, such as Error Diffusion, are incompatible with parallelization and this the WebGL device.