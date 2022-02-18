type CompareFn = (color1: number[], color2: number[]) => number;

// Default palette mapping
// Uses a simple distance check
export function paletteMap(
  color: number[],
  palette: number[][],
  distFn: CompareFn
): readonly number[] {
  let closest: readonly number[] = [];

  let dMin = Number.POSITIVE_INFINITY;
  for (let i = 0; i < palette.length; i++) {
    const dsq = distFn(color, palette[i]);

    if (dsq <= dMin) {
      closest = palette[i];
      dMin = dsq;
    }
  };

  return closest;
}