# Pattern Dithering

Pattern dithering is an implementation of arbitrary-color [ordered dithering](https://en.wikipedia.org/wiki/Ordered_dithering) based on the algorithm of the same name used by Adobe Photoshop for dithering images.

Pattern Dithering differs from [Color Pair Ordered](help/programs/dlab/process/cpo) dithering in that it drops the assumption that thresholding can only be done on a mix of two colors. Instead, Pattern Dithering picks a list of possible colors for each pixel, starting with the closest color and adding the accumulated error to subsequent picks. The threshold matrix is then used to select a color from the list. This allows Pattern Dithering to effectively "mix" as many as 64 colors for a given pixel, thus achieving superior color accuracy on par with or even surpassing error diffusion algorithms.

Pattern Dithering is fully parallelizable and runs on WebGL. Software implementation pending.

For a full explanation of the algorithm, see [How it works: Pattern Dithering](help/how/dlab_pattern).

## Pattern Dithering options

### Mix

The maximum number of colors used in mixing and, by extension, possible mix levels. A higher value will result in higher quality dithering, but you may want to experiment with lower values for aesthetic reasons or for performance resaons.

### Dither

Effectively an intensity scale. Error is multiplied by this value, with a higher error multiplier resulting in more "aggressive" mixing to compensate. At 1.0, error is not reduced and maximum dithering is applied. At 0.0, error is nullified (equivalent to no dithering).

Generally, higher values will be more accurate, but may introduce unwanted noise. The ideal value varies from image to image, and experimentation is recommended for best results.

### Gamma

Value used for gamma correction. The standard value for sRGB and correct for most screens is the default of 2.2, a value of 1.0 does no gamma correction.