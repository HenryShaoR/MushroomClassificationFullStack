import React from "react";
import {normalize} from "../util.ts";

interface DropDownListProps {
    idx: number;
    label: string;
    options: {value: string, label: string}[];
    onSelect: (opt: string) => void;
    selected: string;
}

const DropDownList: React.FC<DropDownListProps> = ({idx, label, options, onSelect, selected}) => {
    return (
        <div key={idx} className="flex flex-col">
            <label htmlFor={`select-${idx}`} className="mb-1 text-sm text-gray-700 truncate">
                {label}
            </label>
            <select
                id={`select-${idx}`}
                className="h-10 rounded border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={selected}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option key="" value="">--</option>
                {options.map(({value, label}) => (
                    <option key={value} value={value}>{normalize(label)}</option>
                ))}
            </select>
        </div>
    );
}

export default DropDownList;