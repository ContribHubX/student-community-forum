import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "@/config/cloudinary";
import { UPLOAD_TYPE } from "@/types";
import { AppError } from "./app-error";

const getCloudinaryFolder = (type: UPLOAD_TYPE) => {
  switch (type) {
    case "thread":
      return "threads";
    case "comment":
      return "comments";
    case "community":
      return "community";
    case "topic":
      return "topics";
    case "task":
      return "tasks";
    default:
      return "uploads";
  }
};
    
const createStorage = (uploadType: UPLOAD_TYPE) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
      const fileExtension = file.mimetype.split("/")[1];

      if (!allowedFormats.includes(fileExtension)) {
        throw new AppError(
          `Invalid file format. Allowed formats are: ${allowedFormats.join(", ")}`,
        );
      }

      return {
        folder: getCloudinaryFolder(uploadType),
        format: fileExtension,
        public_id: `custom_id_${Date.now()}`,
      };
    },
  });
};

// 20MB file size limit (20 * 1024 * 1024 bytes)
const uploadLimit = 25 * 1024 * 1024;

export const uploadThread = multer({
  storage: createStorage("thread"),
  limits: { fieldSize: uploadLimit },  
});

export const uploadComment = multer({
  storage: createStorage("comment"),
  limits: { fieldSize: uploadLimit },  
});

export const uploadCommunity = multer({
  storage: createStorage("community"),
  limits: { fieldSize: uploadLimit },  
}).fields([
  { name: "banner", maxCount: 1 }, 
  { name: "icon", maxCount: 1 }, 
]);

export const uploadTopic = multer({
  storage: createStorage("topic"),
  limits: { fieldSize: uploadLimit },  
});

export const uploadTask = multer({
  storage: createStorage("task"),
  limits: { fieldSize: uploadLimit },  
});
