/**
 * Basemaps Module
 * Configuration and creation of multiple basemap options
 */

export const BASEMAPS = {
    osm: {
        name: 'OpenStreetMap Standard',
        icon: '🗺️',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        options: { minZoom: 1, maxZoom: 28, maxNativeZoom: 19 }
    },
    opentopomap: {
        name: 'OpenTopoMap',
        icon: '⛰️',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '© OpenTopoMap',
        options: { minZoom: 1, maxZoom: 28, maxNativeZoom: 17 }
    },
    cartopositron: {
        name: 'Carto Positron',
        icon: '🌍',
        url: 'https://{s}.basemaps.cartocdn.com/positron/{z}/{x}/{y}{r}.png',
        attribution: '© CartoDB',
        options: { minZoom: 1, maxZoom: 28, maxNativeZoom: 20 }
    },
    cartodark: {
        name: 'Carto Dark Matter',
        icon: '🌙',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© CartoDB',
        options: { minZoom: 1, maxZoom: 28, maxNativeZoom: 20 }
    },
    humanitarian: {
        name: 'Humanitarian OSM',
        icon: '🏥',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        options: { minZoom: 1, maxZoom: 28, maxNativeZoom: 19 }
    }
};

/**
 * Create a basemap layer from key
 */
export function createBasemapLayer(basemapKey, paneId = 'basemap') {
    const basemap = BASEMAPS[basemapKey];
    if (!basemap) throw new Error(`Unknown basemap: ${basemapKey}`);

    return L.tileLayer(basemap.url, {
        pane: paneId,
        attribution: basemap.attribution,
        ...basemap.options
    });
}
