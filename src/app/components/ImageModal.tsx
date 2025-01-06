import Image from "next/image";
import React from "react";
import ImageModalProps from "../types/props/ImageModalProps";

const ImageModal: React.FC<ImageModalProps> = ({
  imgUrl,
  isOpen,
  setIsOpen,
}) => {
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* תמונה קטנה */}
      <Image
        src={`${imgUrl}`}
        alt="Thumbnail"
        height={200}
        width={300}
        className="cursor-pointer"
        onClick={toggleModal}
      />

      {/* מודאל */}
      {isOpen && (
        <div
          className="flex items-center justify-center fixed top-32 bottom-0 inset-0 bg-black bg-opacity-70 z-50 h-[92vh]"
          onClick={toggleModal}
        >
          <Image
            src={`${imgUrl}`}
            alt="Full Image"
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-lg"
          />
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default ImageModal;
