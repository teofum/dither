# Error Diffusion

The error diffusion program applies dithering by choosing the closest color from the palette for each pixel, calculating the error (how different the chosen color is from the actual color), and "spreading" or diffusing that error across neighboring pixels.

Because of each pixel's dependence on the error values calculated from the previous pixels, the error diffusion algorithm is inherently serial and cannot be parallelized. For this reason, error diffusion is only available in Software rendering with no support for multiple threads.

For a complete technical explanation of how error diffusion works, check out the [Wikipedia article on error diffusion](https://en.wikipedia.org/wiki/Error_diffusion).

## Error Diffusion options

### Model

The error diffusion model used. Each model distributes error in a different pattern, achieving different results.

### Diffuse

The error diffusion coefficient. Error is multiplied by this number: at 0.0, no error is diffused (equal to no dithering); at 1.0, the full error is diffused. Lower values reduce the "intensity" of the dithering effect, and may reduce noise.

### Gamma

Value used for gamma correction. The standard value for sRGB and correct for most screens is the default of 2.2, a value of 1.0 does no gamma correction.