/**
 * Data layers and sources configuration 
 * Total: 45 layers across 12 categories
 */

export const DATA_LAYERS = {
    MILITARY: {
        id: 'mil',
        label: 'Military & Security',
        layers: [
            { id: 'mil-bases', label: 'Global Military Bases', source: 'OSINT_STATIC', type: 'icon' },
            { id: 'mil-naval', label: 'Naval Surface Groups', source: 'AIS_LIVE', type: 'path' },
            { id: 'mil-air', label: 'Strategic Aviation', source: 'OPENSKY_LIVE', type: 'icon' },
            { id: 'mil-conflicts', label: 'Active Conflict Zones', source: 'GDELT_LIVE', type: 'polygon' },
            { id: 'mil-sanctions', label: 'Sanctioned Entities', source: 'OFAC_STATIC', type: 'point' }
        ]
    },
    ECONOMIC: {
        id: 'econ',
        label: 'Economic Intelligence',
        layers: [
            { id: 'econ-ports', label: 'Major Trading Ports', source: 'STATIC', type: 'icon' },
            { id: 'econ-routes', label: 'Global Trade Routes', source: 'AIS_DENSITY', type: 'heatmap' },
            { id: 'econ-markets', label: 'Strategic Exchanges', source: 'LIVE_STOCKS', type: 'point' },
            { id: 'econ-supply', label: 'Supply Chain Bottlenecks', source: 'AI_INFERRED', type: 'arc' }
        ]
    },
    DISASTER: {
        id: 'dis',
        label: 'Disaster & Environment',
        layers: [
            { id: 'dis-quakes', label: 'Seismic Activity', source: 'USGS_LIVE', type: 'point' },
            { id: 'dis-fires', label: 'Satellite Fire Detection', source: 'NASA_FIRMS', type: 'heatmap' },
            { id: 'dis-storms', label: 'Cyclones & Storms', source: 'GDACS_LIVE', type: 'polygon' },
            { id: 'dis-flood', label: 'Flood Risks', source: 'GDACS_LIVE', type: 'polygon' }
        ]
    },
    INFRASTRUCTURE: {
        id: 'infra',
        label: 'Critical Infrastructure',
        layers: [
            { id: 'infra-power', label: 'Global Power Grid', source: 'OSM_INFRA', type: 'line' },
            { id: 'infra-cables', label: 'Subsea Cables', source: 'TELEGEOGRAPHY', type: 'line' },
            { id: 'infra-pipelines', label: 'Oil & Gas Pipelines', source: 'OSM_INFRA', type: 'line' },
            { id: 'infra-nuclea', label: 'Nuclear Facilities', source: 'IAEA_STATIC', type: 'icon' },
            { id: 'infra-data', label: 'AI Data Centers', source: 'STATIC', type: 'point' }
        ]
    },
    SIGNALS: {
        id: 'sig',
        label: 'Signal Convergence',
        layers: [
            { id: 'sig-velocity', label: 'News Velocity Heat', source: 'GDELT_LIVE', type: 'heatmap' },
            { id: 'sig-anomalies', label: 'Signal Anomalies', source: 'AI_CORE', type: 'point' },
            { id: 'sig-escalation', label: 'Escalation Index', source: 'AI_CORE', type: 'polygon' }
        ]
    }
};

export const DATA_ENDPOINTS = {
    GDELT: 'https://api.gdeltproject.org/api/v2/doc/doc',
    USGS: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    GDACS: 'https://www.gdacs.org/xml/rss.xml',
    OPENSKY: 'https://opensky-network.org/api/states/all',
    OLLAMA: 'http://localhost:11434/api/generate'
};
