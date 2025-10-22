import React, { useRef, useState } from 'react';
import {FiUpload} from "react-icons/fi";

interface FileUploadProps {
    accept: string;
    onFile: (file: File) => void | Promise<void>;
    className?: string;
    promptText?: string;
    disabled?: boolean;
    children?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
    accept,
    onFile,
    className = '',
    promptText = 'Drop or click to select a file',
    disabled = false,
    children
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        await onFile(file);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await handleFile(file);
        // reset value to allow selecting the same file again
        event.target.value = '';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await handleFile(file);
    };

    return (
        <div
            className={`relative ${className}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className={`border-2 h-full border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
                isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
                {children ? (
                    children
                ) : (
                    <>
                        <FiUpload className="w-8 h-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">{promptText}</span>
                    </>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label={promptText}
                disabled={disabled}
            />
        </div>
    );
};

export default FileUpload;


