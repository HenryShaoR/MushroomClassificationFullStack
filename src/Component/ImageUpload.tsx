import React, { useRef } from 'react';
import FileUpload from "./FileUpload.tsx";
import {FiUpload} from "react-icons/fi";

interface ImageUploadProps {
    setUrl: (url: string) => void;
}

const ImageUpload = ({ setUrl }: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) return;
        try {
            setUrl(await convertToBase64(file) as string);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleFileSelected = async (file: File) => {
        await handleFile(file);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (!file) return;
        await handleFile(file);
    };

    return (
        <div
            className="h-full w-full"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <FileUpload
                accept="image/*"
                onFile={handleFileSelected}
                className="h-full"
                promptText="Drop or click to select an image"
            >
                <FiUpload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Drop or click to select an image</span>
            </FileUpload>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={() => {}} className="hidden" />
        </div>
    );
};

export default ImageUpload;