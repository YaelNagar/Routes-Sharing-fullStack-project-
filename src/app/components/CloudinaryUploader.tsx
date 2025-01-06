"use client";
import { CldUploadButton } from "next-cloudinary";
import PictureProps from "../types/props/PictureProps";
import { handleUpload } from "../functions/pictureFunctions";

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

const CloudinaryUploader: React.FC<PictureProps> = ({ setPictures }) => {
  return (
    <div className="flex items-center justify-center w-[100%] ">
      <CldUploadButton
        options={{
          multiple: true,
          sources: ["local"],
          resourceType: "image",
        }}
        uploadPreset={cloudPresetName}
        onSuccessAction={(event) => handleUpload(event, setPictures)}
        // className="px-4 py-2 w-[100%] shadow-md border-orange-500 text-orange-500 rounded hover:shadow-lg"
        className="mt-4 p-2 border border-orange-500 text-orange-500 hover:bg-orange-300 hover:text-white rounded-2xl w-[200px]"
        >
        <span>צרף תמונה</span>
      </CldUploadButton>
    </div>
  );
};

export default CloudinaryUploader;
