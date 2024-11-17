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

export const uploadThread = multer({ storage: createStorage("thread") });
export const uploadComment = multer({ storage: createStorage("comment") });
export const uploadCommunity = multer({ storage: createStorage("community") })
                                .fields([
                                  { name: "banner", maxCount: 1 }, 
                                  { name: "icon", maxCount: 1 }, 
                                ]);