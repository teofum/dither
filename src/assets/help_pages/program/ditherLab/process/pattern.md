# Pattern Dithering

Pattern dithering is an implementation of arbitrary-color [ordered dithering](https://en.wikipedia.org/wiki/Ordered_dithering) based on the algorithm of the same name used by Adobe Photoshop for dithering images.

Pattern Dithering differs from [Color Pair Ordered](help/programs/dlab/process/cpo) dithering in that it drops the assumption that thresholding can only be done on a mix of two colors. Instead, Pattern Dithering picks a list of possible colors for each pixel, starting with the closest color and adding the accumulated error to subsequent picks. The threshold matrix is then used to select a color from the list. This allows Pattern Dithering to effectively "mix" as many as 64 colors for a given pixel, thus achieving superior color accuracy on par with or even surpassing error diffusion algorithms.

Pattern Dithering is fully parallelizable and runs on WebGL. A software implementation is also available.

For a full explanation of the algorithm, see [How it works: Pattern Dithering](help/how/dlab_pattern).

## Pattern Dithering options

### Threads

This option is only available in software mode. Controls the number of CPU threads used for rendering.

The default **AUTO** setting attempts to balance CPU load and performance by calculating the necessary number of threads based on render size and process complexity, capped at half the available CPU threads. This is the recommended setting.

### Matrix

Threshold map or matrix used for dithering. A larger matrix allows for finer mixing and higher quality. The matrix type changes the look of the dithered image:

* A Bayer Matrix is mathematically balanced and will produce a distinct cross-hatch pattern.
* Blue Noise (Void and Cluster) is randomly generated, and looks similar to error diffusion dithering.
* Halftone maps are clustered maps that produce a circular halftone pattern.

### Mix

The maximum number of colors used in mixing and, by extension, possible mix levels. A higher value will result in higher quality dithering, but you may want to experiment with lower values for aesthetic or performance reasons.

### Dither

Effectively an intensity scale. Error is multiplied by this value, with a higher error multiplier resulting in more "aggressive" mixing to compensate. At 1.0, error is not reduced and maximum dithering is applied. At 0.0, error is nullified (equivalent to no dithering).

Generally, higher values will be more accurate, but may introduce unwanted noise. The ideal value varies from image to image, and experimentation is recommended for best results.

### Gamma

Value used for gamma correction. The standard value for sRGB and correct for most screens is the default of 2.2, a value of 1.0 does no gamma correction.