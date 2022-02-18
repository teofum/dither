const reverseLUT: number[] = Array.from({ length: 100001 });

// Initialize a LUT for gamma correction values
export function initGammaLUT(gamma: number): void {
  for (let i = 0; i <= 100000; i++)
    reverseLUT[i] = Math.pow(i/100000, 1/gamma) * 255;
}

export function gammaCorrect(color: readonly number[], gamma: number = 2.2): number[] {
  const correct = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    correct[i] = Math.pow(color[i] / 255, gamma);
  }
  return correct;
}

export function gammaUncorrect(color: readonly number[]): number[] {
  const uncorrect = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    if (color[i] === 0) uncorrect[i] = 0;
    else if (color[i] < 0) uncorrect[i] = -1 * reverseLUT[~~(-color[i] * 100000)];
    else uncorrect[i] = reverseLUT[~~(color[i] * 100000)];
  }
  return uncorrect;
}

export function gammaCorrectMC(value: number): number {
  return Math.pow(value / 255, 2.2);
}

export function gammaUncorrectMC(value: number): number {
  if (value === 0) return 0;
  if (value < 0) return -1 * reverseLUT[~~(-value * 100000)];
  return reverseLUT[~~(value * 100000)];
}