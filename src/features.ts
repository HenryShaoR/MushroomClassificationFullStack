export interface FeaturesType {
    value: string;
    label: string;
}

export interface FeaturesTypes {
    [feature: string]: FeaturesType[];
}

const features: FeaturesTypes = {
    "odor": [
        { "value": "a", "label": "almond" },
        { "value": "c", "label": "creosote" },
        { "value": "f", "label": "foul" },
        { "value": "l", "label": "anise" },
        { "value": "m", "label": "musty" },
        { "value": "n", "label": "none" },
        { "value": "p", "label": "pungent" },
        { "value": "s", "label": "spicy" },
        { "value": "y", "label": "fishy" }
    ],
    "gill-color": [
        { "value": "b", "label": "black" },
        { "value": "e", "label": "red" },
        { "value": "g", "label": "gray" },
        { "value": "h", "label": "chocolate" },
        { "value": "k", "label": "black" },
        { "value": "n", "label": "brown" },
        { "value": "o", "label": "orange" },
        { "value": "p", "label": "pink" },
        { "value": "r", "label": "green" },
        { "value": "u", "label": "purple" },
        { "value": "w", "label": "white" },
        { "value": "y", "label": "yellow" }
    ],
    "gill-size": [
        { "value": "b", "label": "broad" },
        { "value": "n", "label": "narrow" }
    ],
    "spore-print-color": [
        { "value": "b", "label": "black" },
        { "value": "h", "label": "chocolate" },
        { "value": "k", "label": "black" },
        { "value": "n", "label": "brown" },
        { "value": "o", "label": "orange" },
        { "value": "r", "label": "green" },
        { "value": "u", "label": "purple" },
        { "value": "w", "label": "white" },
        { "value": "y", "label": "yellow" }
    ],
    "ring-type": [
        { "value": "e", "label": "evanescent" },
        { "value": "f", "label": "flaring" },
        { "value": "l", "label": "large" },
        { "value": "n", "label": "none" },
        { "value": "p", "label": "pendant" }
    ],
    "stalk-root": [
        { "value": "?", "label": "missing" },
        { "value": "b", "label": "bulbous" },
        { "value": "c", "label": "club" },
        { "value": "e", "label": "equal" },
        { "value": "r", "label": "rooted" }
    ],
    "population": [
        { "value": "a", "label": "abundant" },
        { "value": "c", "label": "clustered" },
        { "value": "n", "label": "numerous" },
        { "value": "s", "label": "scattered" },
        { "value": "v", "label": "several" },
        { "value": "y", "label": "solitary" }
    ],
    "bruises": [
        { "value": "f", "label": "no" },
        { "value": "t", "label": "bruises" }
    ],
    "stalk-surface-above-ring": [
        { "value": "f", "label": "fibrous" },
        { "value": "k", "label": "silky" },
        { "value": "s", "label": "smooth" },
        { "value": "y", "label": "scaly" }
    ],
    "gill-spacing": [
        { "value": "c", "label": "close" },
        { "value": "w", "label": "crowded" }
    ],
    "stalk-surface-below-ring": [
        { "value": "f", "label": "fibrous" },
        { "value": "k", "label": "silky" },
        { "value": "s", "label": "smooth" },
        { "value": "y", "label": "scaly" }
    ],
    "habitat": [
        { "value": "d", "label": "woods" },
        { "value": "g", "label": "grasses" },
        { "value": "l", "label": "leaves" },
        { "value": "m", "label": "meadows" },
        { "value": "p", "label": "paths" },
        { "value": "u", "label": "urban" },
        { "value": "w", "label": "waste" }
    ],
    "stalk-shape": [
        { "value": "e", "label": "enlarging" },
        { "value": "t", "label": "tapering" }
    ]
};

export const featureList = Object.keys(features);

export default features;