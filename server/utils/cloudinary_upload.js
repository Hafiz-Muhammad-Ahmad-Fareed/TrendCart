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

export const resolveMultipleImagesUpload = async ({
  files,
  images,
  folder,
}) => {
  const uploadPromises = [];

  // Handle multiple files from multipart/form-data
  if (Array.isArray(files) && files.length > 0) {
    for (const file of files) {
      if (file.buffer) {
        uploadPromises.push(uploadBuffer(file.buffer, folder));
      }
    }
  } else if (files?.buffer) {
    // Single file that might come as object instead of array
    uploadPromises.push(uploadBuffer(files.buffer, folder));
  }

  // Handle multiple images from JSON body (URLs or Base64)
  if (Array.isArray(images)) {
    for (const img of images) {
      if (typeof img === "string" && img.trim()) {
        const trimmedImg = img.trim();
        if (
          trimmedImg.startsWith("http://") ||
          trimmedImg.startsWith("https://")
        ) {
          uploadPromises.push(Promise.resolve(trimmedImg));
        } else if (trimmedImg.startsWith("data:image/")) {
          uploadPromises.push(
            cloudinary.uploader
              .upload(trimmedImg, { folder })
              .then((res) => res.secure_url),
          );
        }
      }
    }
  } else if (typeof images === "string" && images.trim()) {
    // Single image from JSON body
    const trimmedImg = images.trim();
    if (trimmedImg.startsWith("http://") || trimmedImg.startsWith("https://")) {
      uploadPromises.push(Promise.resolve(trimmedImg));
    } else if (trimmedImg.startsWith("data:image/")) {
      uploadPromises.push(
        cloudinary.uploader
          .upload(trimmedImg, { folder })
          .then((res) => res.secure_url),
      );
    }
  }

  return Promise.all(uploadPromises);
};
