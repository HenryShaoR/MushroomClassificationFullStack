import { useState } from 'react'
import ImageUpload from "./Component/ImageUpload.tsx";

function App() {
    const [imageUrl, setImageUrl] = useState<string>('')

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
                    {Array.from({ length: 13 }).map((_, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label htmlFor={`select-${idx}`} className="mb-1 text-sm text-gray-700">
                                Select {idx + 1}
                            </label>
                            <select
                                id={`select-${idx}`}
                                className="h-10 rounded border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Choose an option
                                </option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </div>
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

{/* <Select
options={taskTypeOptions}
value={taskTypeOptions.find(o => o.value === (question.type === 'text' ? (question.variant ? 'ea' : 'sa') : question.variant ? 'mcq-multi' : 'mcq-single'))}
onChange={(option: SingleValue<{ value: string; label: string }>) => setQuestionType(index, option?.value as ('sa' | 'ea' | 'mcq-single' | 'mcq-multi'))}
placeholder="Select a task type"
classNamePrefix="react-select"
className="w-fit min-w-52 focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent h-10 text-sm disabled:bg-gray-100"
isSearchable={false}
isDisabled={suggesting}
/> */}
export default App
