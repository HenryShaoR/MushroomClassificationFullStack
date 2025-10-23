// import React, { useEffect, useRef, useState } from 'react';
// import {FiPause, FiPlay} from "react-icons/fi";
//
// interface CameraProps {
//     onAnalyse: () => void;
//     onRealtime: (url: string) => void;
// }
//
// const Camera: React.FC<CameraProps> = ({onAnalyse, onRealtime}) => {
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const isCaptured = useRef<boolean>(false);
//     const [base64Image, setBase64Image] = useState<string>('');
//
//     useEffect(() => {
//         const getCameraStream = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     // Ensure video element size is properly set
//                     videoRef.current.onloadedmetadata = () => {
//                         if (videoRef.current) {
//                             videoRef.current.play(); // Ensure video starts playing
//                         }
//                     };
//                 }
//             } catch (err) {
//                 console.error("Error accessing the camera: ", err);
//             }
//         };
//
//         getCameraStream().then();
//
//         // Cleanup function to stop the stream when the component unmounts
//         return () => {
//             const video = videoRef.current;
//             if (video && video.srcObject) {
//                 const stream = video.srcObject as MediaStream;
//                 const tracks = stream.getTracks();
//                 tracks.forEach(track => track.stop());
//             }
//         };
//     }, []);
//
//     useEffect(() => {
//         const captureFrameAtInterval = () => {
//             const fps = 30;
//             const interval = 1000 / fps;
//
//             setInterval(() => {
//                 if (!isCaptured.current && videoRef.current && canvasRef.current) {
//                     const canvas = canvasRef.current;
//                     const context = canvas.getContext('2d');
//                     const video = videoRef.current;
//
//                     canvas.width = video.videoWidth;
//                     canvas.height = video.videoHeight;
//
//                     if (video && context) {
//                         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//                         const base64 = canvas.toDataURL('image/png');
//                         setBase64Image(base64);
//                         onRealtime(base64);
//                     }
//                 }
//             }, interval);
//         };
//
//         captureFrameAtInterval()
//     }, [onRealtime]);
//
//     return (
//         <div className="absolute z-20">
//             <video ref={videoRef} className="hidden"/>
//             <img src={base64Image} alt="Live Image" className="w-full h-auto object-cover" />
//             <button
//                 onClick={() => {
//                     if (!isCaptured.current) {
//                         onAnalyse();
//                     }
//                     isCaptured.current = !isCaptured.current
//                 }}
//                 className="absolute z-30 bottom-5 left-1/2 transform -translate-x-1/2 p-4 text-lg font-semibold bg-white rounded-full shadow-md transition-all opacity-20"
//             >
//                 { isCaptured.current ?
//                     <FiPlay /> : <FiPause />
//                 }
//             </button>
//             <canvas ref={canvasRef} style={{ display: 'none' }} />
//         </div>
//     );
// };
//
// export default Camera;
