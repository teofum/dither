// Utility functions specific to color handling
// There are enough of these to put in a separate file
// Formula reference: http://www.easyrgb.com/en/math.php

// All conversions use a D65/2° standard illuminant where applicable

// Gets luminance for a color in sRGB
export function luma_srgb(rgb: readonly number[]): number {
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / (255.0 * 1000);
}

export function luma_linear(lrgb: readonly number[]): number {
  return lrgb[0] * 0.2126 + lrgb[1] * 0.7152 + lrgb[2] * 0.0722;
}

// Converts sRGB to linear RGB
export function srgb2linear(rgb: readonly number[], gamma: number = 2.2): number[] {
  return rgb.map(val => {
    let vNew = val / 255.0;
    vNew = (vNew > 0.04045) ?
      Math.pow((vNew + 0.055) / 1.055, gamma) :
      vNew / 12.92;
    return vNew * 100;
  });
}

// Converts linear RGB to sRGB
export function linear2srgb(lrgb: readonly number[], gamma: number = 2.2): number[] {
  return lrgb.map(val => {
    let vNew = val / 100.0;
    vNew = (vNew > 0.0031308) ?
      1.055 * Math.pow(vNew, 1 / gamma) - 0.055 :
      vNew * 12.92;
    return ~~(vNew * 255);
  });
}

// Converts sRGB to XYZ color space
export function srgb2xyz(rgb: readonly number[], gamma: number = 2.2): number[] {
  const lrgb = srgb2linear(rgb, gamma);
  return [
    lrgb[0] * 0.4124 + lrgb[1] * 0.3576 + lrgb[2] * 0.1805, // X
    lrgb[0] * 0.2126 + lrgb[1] * 0.7152 + lrgb[2] * 0.0722, // Y
    lrgb[0] * 0.0193 + lrgb[1] * 0.1192 + lrgb[2] * 0.9505  // Z
  ];
}

// Converts XYZ color space to sRGB
export function xyz2srgb(xyz: readonly number[], gamma: number = 2.2): number[] {
  const lrgb = [
    xyz[0] * 3.2406 + xyz[1] * -1.5372 + xyz[2] * -0.4986,
    xyz[0] * -0.9689 + xyz[1] * 1.8758 + xyz[2] * 0.0415,
    xyz[0] * 0.0557 + xyz[1] * -0.2040 + xyz[2] * 1.0570
  ];
  return linear2srgb(lrgb, gamma);
}

// Converts XYZ color to CIE-L*ab
export function xyz2lab(xyz: readonly number[]): number[] {
  let ixyz = [
    xyz[0] * 95.047,
    xyz[1] * 100.000,
    xyz[2] * 108.883
  ];

  ixyz = ixyz.map(val => (val > 0.008856) ?
    Math.pow(val, 1 / 3) :
    (val * 7.787) + (16 / 116)
  );

  return [
    (116 * ixyz[1]) - 16,       // L
    500 * (ixyz[0] - ixyz[1]),  // a
    200 * (ixyz[1] - ixyz[2])   // b
  ];
}

// Converts CIE-L*ab to XYZ color
export function lab2xyz(lab: readonly number[]): number[] {
  const iy = (lab[0] + 16) / 116;
  let ixyz = [
    lab[1] / 500 + iy,
    iy,
    iy - (lab[2] / 200)
  ];

  ixyz = ixyz.map(val => {
    const cubed = Math.pow(val, 3);
    return (cubed > 0.008856) ?
      cubed :
      (val - 16 / 116) / 7.787;
  });

  return [
    ixyz[0] * 95.047,
    ixyz[1] * 100.000,
    ixyz[2] * 108.883
  ];
}

// Converts sRGB to CIE-L*ab
export function srgb2lab(rgb: readonly number[], gamma: number = 2.2): number[] {
  return xyz2lab(srgb2xyz(rgb, gamma));
}

// Converts CIE-L*ab to sRGB
export function lab2srgb(rgb: readonly number[], gamma: number = 2.2): number[] {
  return xyz2srgb(lab2xyz(rgb), gamma);
}
