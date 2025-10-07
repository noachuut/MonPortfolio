export const resizeImageFile = (
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> => {
  const { maxWidth = 1280, maxHeight = 720, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Impossible de créer le contexte du canvas"));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const outputFormat = file.type.includes("png") ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(outputFormat, quality));
      };

      image.onerror = (error) => reject(error);
      image.src = event.target?.result as string;
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
