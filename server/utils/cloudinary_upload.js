import cloudinary from "../config/cloudinary.config.js";

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });

export const resolveImageUpload = async ({ file, image, folder }) => {
  if (file?.buffer) {
    return uploadBuffer(file.buffer, folder);
  }

  if (typeof image !== "string" || !image.trim()) {
    return null;
  }

  const trimmedImage = image.trim();

  if (
    trimmedImage.startsWith("http://") ||
    trimmedImage.startsWith("https://")
  ) {
    return trimmedImage;
  }

  if (trimmedImage.startsWith("data:image/")) {
    const result = await cloudinary.uploader.upload(trimmedImage, {
      folder,
    });

    return result.secure_url;
  }

  return null;
};
