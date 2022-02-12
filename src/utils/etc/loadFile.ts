interface LoadResult {
  image: HTMLImageElement;
  filename: string;
}

const loadFile = (e: Event): Promise<LoadResult> => {
  return new Promise((resolve, reject) => {
    const input = e.target as HTMLInputElement;
    if (input?.files) {
      const file = input.files[0];
      const img = new Image();
      img.onload = () => resolve({
        image: img,
        filename: file.name
      });

      img.src = URL.createObjectURL(file);
    } else reject();
  });
};

export default loadFile;