/**
 * Map Configuration Module
 * Centralized configuration for map initialization and layers
 */

export const MAP_CONFIG = {
    mapId: 'map',
    zoomControl: false,
    maxZoom: 28,
    minZoom: 1,
    initialBounds: [[-1.096711347023937, 37.0126189739114], [-1.0950735356271848, 37.014650355453995]],
    defaultCenter: [-1.0958574408255609, 37.01363466368270],
    defaultZoom: 18
};

export const BASEMAP_CONFIG = {
    id: 'pane_OpenStreetMap_0',
    zIndex: 400,
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    opacity: 1,
    minZoom: 1,
    maxZoom: 28
};

export const LAYERS_CONFIG = [
    {
        id: 'pane_Buildings_1',
        name: 'Buildings',
        zIndex: 401,
        legendImage: 'legend/Buildings_1.png',
        dataVar: 'json_Buildings_1'
    }
];
