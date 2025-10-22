import { useState } from 'react'
import ImageUpload from "./Component/ImageUpload.tsx";
import features, {featureList} from "./features.ts";
import DropDownList from "./Component/DropDownList.tsx";
import {normalize} from "./util.ts";

function App() {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [chosen, setChosen] = useState<(string)[]>(new Array(featureList.length).fill(""));

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
                    <h2 className="">It is edible/poisonous</h2>
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
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <button
                        className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:scale-105 hover:bg-red-50 transition-all duration-300"
                        onClick={() => setImageUrl('')}
                    > Clear </button>
                    <button
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:scale-105 hover:bg-indigo-600 transition-all duration-300"
                        onClick={() => setImageUrl('')}
                    > Analyse </button>

                </div>
            </div>
        </div>
    )
}
export default App
