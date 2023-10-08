import { uploadFile } from "@/api/upload";
import { useState } from "react";

export type UploadState = {
  images: string[];
  uploading: number;
  handleUploadFile: (file: File, multiple?: boolean) => void;
  removeImage: (url: string) => void;
};

interface UseUploadFileOption {
  onUpload?: (url: string) => void;
  onError?: (e: Error) => void;
}

export function useUploadFile(urls: string[], {
  onUpload = () => {},
  onError = () => {},
}: UseUploadFileOption = {}): UploadState {
  const [uploading, setUploading] = useState(0);
  const [images, setImages] = useState<string[]>(urls);

  async function handleUploadFile(file: File, multiple = false) {
    setUploading((x) => x + 1);
    try {
      const url = await uploadFile(file);
      onUpload(url);
      if (multiple) {
        console.log(url);
        setImages([...images, url]);
      } else {
        setImages([url]);
      }
    } catch (e) {
      if (e instanceof Error) {
        onError(e);
      } else {
        throw e;
      }
    } finally {
      setUploading((x) => x - 1);
    }
  }
  function removeImage(url: string) {
    setImages(images.filter((image) => image !== url));
  }
  return {
    images,
    uploading,
    handleUploadFile,
    removeImage,
  };
}
