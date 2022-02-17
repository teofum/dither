# Color Pair Ordered

Color pair ordered dithering is an implementation of arbitrary-color [ordered dithering](https://en.wikipedia.org/wiki/Ordered_dithering) that attempts to find the mix of two palette colors that best represents a given pixel, then applies a threshold matrix to the mix.

The algorithm can be easily parallelized and is implemented exclusively for the WebGL device. While a software implementation is possible, color pair ordered dithering's complexity can cause it to become extremely slow when used with larger palettes of more than 16 colors.

For a full explanation of the algorithm, see [How it works: Color Pair Ordered](help/how/dlab_cpo).

## Color Pair Ordered options

### Gamma

Value used for gamma correction. The standard value for sRGB and correct for most screens is the default of 2.2, a value of 1.0 does no gamma correction.