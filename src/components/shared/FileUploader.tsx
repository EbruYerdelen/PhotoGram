import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
}



const FileUploader = ({fieldChange , mediaUrl}: FileUploaderProps) => {
  //file state is empty array since we can set multiple files
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  //set the fileUrl initially to mediaUrl prop you got from PostForm so that you can directly see existing image and similarly 
  //you are able to drag a file and edit just like how you made in CreatePost



  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, [file]);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*" : [".png" , ".jpeg" , ".jpg" , ".svg"]
    }
  });


  return (
    <div
      {...getRootProps()}
      className="flex flex-col flex-center bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center p-5 lg:p-10 w-full">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
            <p className="file_uploader-label">
              Click or drag photo to replace
            </p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={92}
            height={74}
            alt="file-upload"
          />
          <h3 className="mt-4 mb-1 text-light-2 base-medium">
            Drag photo here
          </h3>
          <p className="mb-6 text-light-4 small-regular">SVG, PNG, JPG</p>
          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
//here we usad a package to upload photos to our app which is https://react-dropzone.js.org/