# Color Pair Ordered

Color pair ordered dithering is an implementation of arbitrary-color [ordered dithering](https://en.wikipedia.org/wiki/Ordered_dithering) that attempts to find the mix of two palette colors that best represents a given pixel, then applies a threshold matrix to the mix.

The algorithm can be easily parallelized and is implemented exclusively for the WebGL device. While a software implementation is possible, color pair ordered dithering's complexity can cause it to become extremely slow when used with larger palettes of more than 16 colors.

For a full explanation of the algorithm, see [How it works: Color Pair Ordered](help/how/dlab_cpo).

## Color Pair Ordered options

### Matrix

Threshold map or matrix used for dithering. A larger matrix allows for finer mixing and higher quality. The matrix type changes the look of the dithered image:

* A Bayer Matrix is mathematically balanced and will produce a distinct cross-hatch pattern.
* Blue Noise (Void and Cluster) is randomly generated, and looks similar to error diffusion dithering.
* Halftone maps are clustered maps that produce a circular halftone pattern.

### Variance

Variance is a mix control parameter that reduces the penalty for mixing two colors distant from each other. Higher variance increases color accuracy, but might introduce noise, odd-looking mixes and artifacts.

The ideal value for variance depends on the image and palette: a palette with colors closer to those of the image and to each other will allow higher variance before mix artifacts occur.
  
### Gamma

Value used for gamma correction. The standard value for sRGB and correct for most screens is the default of 2.2, a value of 1.0 does no gamma correction.