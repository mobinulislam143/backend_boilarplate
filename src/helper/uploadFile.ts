
import ApiError from "../errors/ApiError";
import { uploadToDigitalOceanAWS } from "./uploadToDigitalOceanAws";

export const uploadFile = async (file: Express.Multer.File, fileName: string) => {
    if (!file) {
      throw new ApiError(400, `${fileName} image is required`);
    }
    return await uploadToDigitalOceanAWS(file);
  };