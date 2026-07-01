/**
 * Map Core Module
 * Handles core map initialization and management
 */

import { MAP_CONFIG, BASEMAP_CONFIG } from './map-config.js';

export class MapCore {
    constructor(configOptions = {}) {
        this.config = { ...MAP_CONFIG, ...configOptions };
        this.map = null;
        this.layers = {};
        this.controls = {};
        this.hash = null;
    }

    /**
     * Initialize the map
     */
    initialize() {
        // Create map instance
        this.map = L.map(this.config.mapId, {
            zoomControl: this.config.zoomControl,
            maxZoom: this.config.maxZoom,
            minZoom: this.config.minZoom
        });

        // Set initial bounds
        this.map.fitBounds(this.config.initialBounds);

        // Add hash for URL state persistence
        this.hash = new L.Hash(this.map);

        // Configure attribution
        this.map.attributionControl.setPrefix(
            '<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; ' +
            '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
        );

        return this.map;
    }

    /**
     * Add a basemap layer
     */
    addBasemap(config = BASEMAP_CONFIG) {
        this.map.createPane(config.id);
        this.map.getPane(config.id).style.zIndex = config.zIndex;

        const basemap = L.tileLayer(config.url, {
            pane: config.id,
            opacity: config.opacity,
            attribution: config.attribution,
            minZoom: config.minZoom,
            maxZoom: config.maxZoom,
            minNativeZoom: 0,
            maxNativeZoom: 19
        });

        this.map.addLayer(basemap);
        this.layers.basemap = basemap;
        return basemap;
    }

    /**
     * Get the map instance
     */
    getMap() {
        return this.map;
    }

    /**
     * Get all layers
     */
    getLayers() {
        return this.layers;
    }

    /**
     * Add a layer
     */
    addLayer(key, layer) {
        this.layers[key] = layer;
        return layer;
    }

    /**
     * Get a specific layer
     */
    getLayer(key) {
        return this.layers[key];
    }

    /**
     * Remove a layer
     */
    removeLayer(key) {
        if (this.layers[key]) {
            this.map.removeLayer(this.layers[key]);
            delete this.layers[key];
        }
    }

    /**
     * Fit map to bounds
     */
    fitBounds(bounds, options = {}) {
        this.map.fitBounds(bounds, {
            padding: [50, 50],
            animate: true,
            ...options
        });
    }
}
