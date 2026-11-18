const cloudinary = require("./cloudinary");
//                         file memory  folder
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    // flutter stream bits  stream upload 
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = uploadToCloudinary;