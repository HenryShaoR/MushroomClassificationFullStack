import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import features, {featureList} from "./features.ts";
import DropDownList from "./Component/DropDownList.tsx";
import {normalize} from "./util.ts";
import type {DetectionBox} from "./types.ts";
import {FiPause, FiPlay} from "react-icons/fi";

function App() {
    const baseUrl = "http://localhost:8000";

    const [imageUrl, setImageUrl] = useState<string>('');
    const [chosen, setChosen] = useState<(string)[]>(new Array(featureList.length).fill(""));
    const [lrResult, setLrResult] = useState<number | null>(null);
    const [lrLoading, setLrLoading] = useState<boolean>(false);
    const {validFeatureCount} = useMemo(() => ({validFeatureCount: chosen.filter(f => f !== "").length}), [chosen]);
    const isCaptured = useRef<boolean>(false);

    const getPercentageColour = (percentage: number | null) => {
        return  percentage === null ? "text-red-600" :
            percentage > 80 ?
                "text-green-500" :
                percentage > 60 ?
                    "text-yellow-400" :
                    percentage > 40 ?
                        "text-yellow-600" :
                        percentage > 20 ?
                            "text-orange-600" :
                            "text-red-600"
    };

    const [detectionBoxes, setDetectionBoxes] = useState<DetectionBox[]>([]);
    const { w, h } = useMemo(() => {
        const img = new Image();
        const dimensions = { w: 0, h: 0 };
        img.onload = () => {
            dimensions.w = img.naturalWidth;
            dimensions.h = img.naturalHeight;
        };
        img.src = imageUrl;
        return dimensions;
    }, [imageUrl]);


    const handleLr = useCallback(async () => {
        const payload: {[feature: string]: string} = {};
        for (let i = 0; i < featureList.length; i++) {
            if (chosen[i]) {
                payload[featureList[i]] = chosen[i];
            }
        }

        if (Object.keys(payload).length === 0) {
            setLrResult(null);
            return;
        }

        setLrLoading(true);
        try {
            const res = await fetch(`${baseUrl}/lr`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                console.error(res.statusText);
                return;
            }

            setLrResult(Math.round(await res.json() * 10000) / 100.0);
        } catch (error) {
            console.error(error);
        } finally {
            setLrLoading(false);
        }
    }, [chosen]);

    useEffect(() => {
        handleLr().then();
    }, [handleLr]);


    const [yoloLoading, setYoloLoading] = useState<boolean>(false);
    const handleYOLO = useCallback(async (analyse: boolean) => {
        if (imageUrl === '' || (isCaptured.current && !analyse)) {
            setDetectionBoxes([]);
            return;
        }

        if (analyse) {
            setYoloLoading(true);
            try {
                const res = await fetch(`${baseUrl}/analyze`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({image: imageUrl}),
                });

                if (!res.ok) {
                    console.error(res.statusText);
                    return;
                }

                setDetectionBoxes(await res.json() as DetectionBox[]);
            } catch (error) {
                console.error(error);
            } finally {
                setYoloLoading(false);
            }
        } else {
            try {
                const res = await fetch(`${baseUrl}/detect`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({image: imageUrl}),
                });

                if (!res.ok) {
                    console.error(res.statusText);
                    return;
                }
                const detBoxes: Partial<DetectionBox>[] = await res.json();
                const detectionBoxes = detBoxes.map(b => ["", b[0], b[1], b[2], b[3], 0, true]);
                setDetectionBoxes(detectionBoxes as DetectionBox[]);
            } catch (error) {
                console.error(error);
            }
        }
    }, [imageUrl]);

    useEffect(() => {
        handleYOLO(false).then();
    }, [handleYOLO]);

    const {detectionBoxesUrl} = useMemo(() => {
        if (detectionBoxes.length === 0) return {detectionBoxes: ''};

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = w;
        canvas.height = h;

        if (!ctx) {
            console.error("Cannot find Canvas Rendering Context");
            return {detectionBoxesUrl: ''};
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        detectionBoxes.forEach(([species, x, y, x2, y2, conf, is_poisonous]) => {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 5;
            ctx.strokeRect(x, y, x2 - x, y2 - y);

            if(isCaptured.current) {
                const text = `${Math.round(conf*10000) / 100.0}% is ${species} (${is_poisonous ? 'poisonous' : 'edible'})`;
                const fontSize = 30;
                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = 'white';

                const backgroundColor = 'blue';

                const textWidth = ctx.measureText(text).width;
                const textHeight = fontSize;

                const padding = 10;
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x, y, textWidth + 2 * padding, textHeight + 2 * padding);

                ctx.fillStyle = 'white';
                ctx.fillText(text, x + padding, y + textHeight + padding);
            }
        });
        return {detectionBoxesUrl: canvas.toDataURL('image/png')};
    }, [detectionBoxes, w, h]);

    const {mostProbable} = useMemo(() => ({
        mostProbable: detectionBoxes.length === 0 || !isCaptured.current ? [] : detectionBoxes
            .reduce((b, prev) => b[5] > prev[5] ? b : prev)
    }), [detectionBoxes]);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Ensure video element size is properly set
                    videoRef.current.onloadedmetadata = () => {
                        if (videoRef.current) {
                            videoRef.current.play(); // Ensure video starts playing
                        }
                    };
                }
            } catch (err) {
                console.error("Error accessing the camera: ", err);
            }
        };

        getCameraStream().then();

        // Cleanup function to stop the stream when the component unmounts
        return () => {
            const video = videoRef.current;
            if (video && video.srcObject) {
                const stream = video.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const captureFrameAtInterval = () => {
            const fps = 10;
            const interval = 1000 / fps;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            setInterval(() => {
                if (!isCaptured.current && videoRef.current) {
                    const video = videoRef.current;

                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    if (video && ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const base64 = canvas.toDataURL('image/png');
                        setImageUrl(base64);
                    }
                }
            }, interval);
        };

        captureFrameAtInterval()
    }, []);

    return (
        <div className="h-screen w-full flex space-x-4 bg-gray-100">
            {/* Left: Image upload/display */}
            <div className="w-full border-r border-gray-200 flex items-center justify-center p-6 justify-items-center">
                <div className="w-full h-full flex items-center justify-center justify-items-center relative" >
                    <video ref={videoRef} className="hidden"/>
                    <img src={imageUrl} alt="Live Image" className="absolute z-10 cursor-pointer" />
                    <img src={detectionBoxesUrl} alt="" className="absolute z-20 cursor-pointer"/>
                    <button
                        onClick={() => {
                            if (!isCaptured.current) {
                                setDetectionBoxes([]);
                                handleYOLO(true).then();
                            }
                            isCaptured.current = !isCaptured.current
                        }}
                        className="absolute z-30 bottom-5 left-1/2 transform -translate-x-1/2 p-4 text-lg font-semibold bg-white rounded-full shadow-lg transition-all"
                    >
                        { isCaptured.current ?
                            <FiPlay /> : <FiPause />
                        }
                    </button>
                </div>
            </div>

            {/* Right: 13 dropdowns */}
            <div className="w-full max-h-screen overflow-y-auto p-6">
                <div className="w-full flex-col">
                    { yoloLoading ?
                        <div className="flex justify-center items-center space-x-2 mt-4">
                            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                            <span className="text-blue-500">Analysing...</span>
                        </div> :
                        <h2 className="text-lg font-semibold">
                            { mostProbable.length === 0 ?
                                "We didn't find any mushrooms in the image":
                                <>
                                    The most probable mushroom in the image is&nbsp;
                                    {mostProbable[0]}
                                    <span className={mostProbable[6] ? "text-red-600" : "text-green-600"}>{mostProbable[6] ? ' (poisonous)' : ' (edible)'}</span>.
                                    <br/>
                                    We are
                                    <span className={getPercentageColour(mostProbable[5] * 100)}>{` ${Math.round(mostProbable[5]*10000)/100.0}% `}</span>
                                    confident on that.
                                </>
                            }
                        </h2>
                    }
                    { lrLoading ?
                        <div className="flex justify-center items-center space-x-2 mt-4">
                            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                            <span className="text-blue-500">Analysing...</span>
                        </div> :
                        <>
                            <h2 className="whitespace-pre-wrap mt-4">
                                {lrResult === null ?
                                    'Please provide some features to analyse':
                                    <>
                                        It is
                                        <span className={`${getPercentageColour(2*Math.max(lrResult, 100 - lrResult)-100)}`}>{' ' + String(Math.max(lrResult, 100 - lrResult)).substring(0, 5) + '% '}</span>
                                        that the mushroom is
                                        <span className={lrResult > 100 - lrResult ? "text-red-600" : "text-green-600"}>{lrResult > 100 - lrResult ? ' poisonous ' : ' edible '}</span>
                                        based on the features you provided below
                                    </>
                                }
                            </h2>
                            {0 < validFeatureCount && validFeatureCount <= 3 &&
                                <h2 className="whitespace-pre-wrap mt-2 text-orange-600">
                                    {`You provided ${validFeatureCount} features, which might not provide an accurate result`}
                                </h2>
                            }
                        </>
                    }
                </div>
                { mostProbable.length > 0 && lrResult !== null &&
                    <>
                        <div className="border-t border-gray-200 mt-3 pb-3"/>
                        <div className="flex items-center justify-center">
                            <span className={mostProbable[6] === lrResult >= 50 ? "text-green-500" : "text-red-500"}>
                                {mostProbable[6] === lrResult >= 50 ? "Analysis from image and features agree using 50% threshold." : "WARNING: Analysis from image and features DISAGREE using 50% threshold. Please proceed with care."}
                            </span>
                        </div>
                    </>
                }
                <div className="border-t border-gray-200 mt-3 pb-6"/>
                <span>Help us to verify our conclusion by providing details that might not be visible in the image:</span>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    {featureList.map((feature, idx) => (
                        <DropDownList
                            key={feature}
                            idx={idx}
                            label={normalize(feature)}
                            onSelect={(newChoice) => setChosen(prev=> {
                                const newList = [...prev];
                                newList[idx] = newChoice;
                                return newList;
                            })}
                            options={features[feature]}
                            selected={chosen[idx]}
                        />
                    ))}
                    <div key="clear" className="flex flex-col justify-end">
                        <button
                            className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:scale-105 hover:bg-red-50 transition-all duration-300"
                            onClick={() => setChosen(prev => window.confirm("Clear all features?") ? new Array(featureList.length).fill("") : prev)}
                        > Clear </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default App
