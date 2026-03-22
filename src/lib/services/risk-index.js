/**
 * Country Intelligence Index (CII)
 * Composite risk scoring across 12 signal categories
 */

export const CII_CATEGORIES = [
    'ECONOMIC', 'GEOPOLITICAL', 'MILITARY', 'CYBER', 
    'INFRASTRUCTURE', 'HEALTH', 'CLIMATE', 'SOCIAL', 
    'INFORMATION', 'SPACE', 'MARITIME', 'ENERGY'
];

export const MOCK_COUNTRY_DATA = {
    "IND": { name: "INDIA", scores: [72, 85, 45, 60, 68, 75, 40, 65, 80, 70, 75, 62] },
    "PAK": { name: "PAKISTAN", scores: [30, 42, 85, 40, 35, 50, 25, 30, 45, 20, 40, 38] },
    "CHN": { name: "CHINA", scores: [88, 92, 75, 85, 90, 80, 55, 78, 85, 95, 90, 88] },
    "USA": { name: "UNITED STATES", scores: [92, 95, 80, 90, 85, 88, 65, 75, 82, 98, 95, 90] },
    "RUS": { name: "RUSSIA", scores: [45, 55, 95, 88, 60, 50, 45, 40, 75, 85, 70, 95] },
    "UKR": { name: "UKRAINE", scores: [25, 85, 98, 75, 30, 40, 40, 55, 95, 30, 20, 35] }
};

export function calculateCompositeRisk(iso) {
    const data = MOCK_COUNTRY_DATA[iso];
    if (!data) return 50;
    
    // Weighted logic could be applied here
    // For now, simple average of all 12 signals
    const sum = data.scores.reduce((a, b) => a + b, 0);
    return (sum / 12).toFixed(1);
}

export function getCategoryScore(iso, categoryIndex) {
    const data = MOCK_COUNTRY_DATA[iso];
    if (!data) return 0;
    return data.scores[categoryIndex];
}
