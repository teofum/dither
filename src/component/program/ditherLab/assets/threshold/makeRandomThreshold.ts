const makeRandomThreshold = (size: number) => {
  const data = Array.from(Array(size * size), () => Math.random() * 255);
  return { size, data };
};

export default makeRandomThreshold;