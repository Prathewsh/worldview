/**
 * Variant Store - Manages the 5 site variants
 * WORLD, TECH, FINANCE, COMMODITY, HAPPY
 */

import { writable } from 'svelte/store';

export const VARIANTS = {
    WORLD: { id: 'world', label: 'GLOBAL STRATEGIC', accent: '#38bdf8', icon: 'Globe' },
    TECH: { id: 'tech', label: 'CYBER & SILICON', accent: '#8b5cf6', icon: 'Cpu' },
    FINANCE: { id: 'finance', label: 'GLOBAL CAPITAL', accent: '#10b981', icon: 'TrendingUp' },
    COMMODITY: { id: 'commodity', label: 'ENERGY & ORE', accent: '#f59e0b', icon: 'Zap' },
    HAPPY: { id: 'happy', label: 'GLOBAL OPTIMISM', accent: '#ec4899', icon: 'Heart' }
};

export const currentVariant = writable(VARIANTS.WORLD);

export function setVariant(id) {
    const v = Object.values(VARIANTS).find(v => v.id === id);
    if (v) currentVariant.set(v);
}
