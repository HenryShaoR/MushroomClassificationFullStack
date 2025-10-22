import {useCallback, useEffect, useMemo, useState} from 'react'
import ImageUpload from "./Component/ImageUpload.tsx";
import features, {featureList} from "./features.ts";
import DropDownList from "./Component/DropDownList.tsx";
import {normalize} from "./util.ts";

function App() {
    const baseUrl = "http://localhost:8000";

    const [imageUrl, setImageUrl] = useState<string>('');
    const [chosen, setChosen] = useState<(string)[]>(new Array(featureList.length).fill(""));
    const [lrResult, setLrResult] = useState<number | null>(null);
    const [lrLoading, setLrLoading] = useState<boolean>(false);
    const {validFeatureCount} = useMemo(() => ({validFeatureCount: chosen.filter(f => f !== "").length}), [chosen]);
    const {percentageColour} = useMemo(() => ({
        percentageColour: lrResult === null ? "text-red-900" :
            lrResult < 20 ?
            "text-green-500" :
            lrResult < 40 ?
                "text-yellow-400" :
                lrResult < 60 ?
                    "text-yellow-600" :
                    lrResult < 80 ?
                        "text-orange-600" :
                        "text-red-600"
    }), [lrResult]);


    const handleSubmit = useCallback(async () => {
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
        handleSubmit().then();
    }, [handleSubmit]);

    return (
        <div className="h-screen w-full flex space-x-4">
            {/* Left: Image upload/display */}
            <div className="w-full border-r border-gray-200 flex items-center justify-center p-6 justify-items-center">
                <div className="w-full h-full flex items-center justify-center justify-items-center">
                    { imageUrl ?
                        <div
                            className="relative w-full h-full flex items-center justify-center justify-items-center"
                            onClick={() => setImageUrl('')}
                        >
                            <img
                                src={imageUrl}
                                alt=""
                                className="absolute z-10 cursor-pointer"
                            />
                            <div className="absolute z-20 cursor-pointer">
                                Overlap
                            </div>
                        </div> :
                        <ImageUpload setUrl={setImageUrl} />
                    }
                </div>
            </div>

            {/* Right: 13 dropdowns */}
            <div className="w-full max-h-screen overflow-y-auto p-6 space-y-6">
                <div className="w-full flex-col">
                    <h2 className="text-lg font-semibold">The mushroom is ...</h2>
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
                                        <span className={`${percentageColour}`}>{' ' + lrResult + '% '}</span>
                                        that the mushroom is poisonous based on the features you provided below
                                    </>
                                }
                            </h2>
                            {0 < validFeatureCount && validFeatureCount <= 3 &&
                                <h2 className="whitespace-pre-wrap mt-6 text-orange-600">
                                    {`You provided ${validFeatureCount} features, which might not provide an accurate result`}
                                </h2>
                            }
                        </>
                    }

                </div>
                <div className="border-b border-gray-200"/>
                <div className="grid grid-cols-2 gap-4">
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
