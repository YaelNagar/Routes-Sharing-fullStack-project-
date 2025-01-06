import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Dispatch, SetStateAction } from "react";
import Swal from 'sweetalert2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleUpload = (
  result: CloudinaryUploadWidgetResults,
  setPictures: Dispatch<SetStateAction<string[]>>
) => {
  if (
    result?.info &&
    typeof result.info !== "string" &&
    "secure_url" in result.info
  ) {
    const imageUrl = result.info.secure_url;
    // const publicId = result.info.public_id; 

    // localStorage.setItem('uploadedImage', JSON.stringify({ publicId, imageUrl }));
    setPictures((prevInfo: string[]) => [...prevInfo, imageUrl]);
  } else {
    console.error("Failed to upload image. Result info is invalid.");
    Swal.fire({
      icon: 'error',
      title: 'שגיאה!',
      text: 'העלאה נכשלה. אנא נסה שוב.',
      confirmButtonText: 'אוקי'
    });
  }
};
