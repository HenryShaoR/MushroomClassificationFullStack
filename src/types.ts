export interface FeaturesType {
    value: string;
    label: string;
}

export interface FeaturesTypes {
    [feature: string]: FeaturesType[];
}

export type DetectionBox = [string, number, number, number, number, number, boolean];  // species, left, top, right, bottom, confidence, is_poisonous