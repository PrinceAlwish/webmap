/**
 * Basemap Switcher Module
 * Provides UI control to switch between different basemaps
 */

import { BASEMAPS, createBasemapLayer } from './basemaps.js';

export class BasemapSwitcher {
    constructor(mapInstance, initialBasemap = 'osm') {
        this.map = mapInstance;
        this.currentBasemap = initialBasemap;
        this.basemapLayers = {};
        this.paneId = 'basemap-pane';
        
        // Create pane for basemaps
        if (!this.map.getPane(this.paneId)) {
            this.map.createPane(this.paneId);
        }
        this.map.getPane(this.paneId).style.zIndex = 400;
        
        // Initialize all basemaps
        this._initializeBasemaps();
        
        // Add the initial basemap
        this.setBasemap(initialBasemap);
    }

    /**
     * Initialize all basemaps
     */
    _initializeBasemaps() {
        Object.keys(BASEMAPS).forEach(key => {
            const layer = createBasemapLayer(key, this.paneId);
            this.basemapLayers[key] = layer;
        });
    }

    /**
     * Set the active basemap
     */
    setBasemap(basemapKey) {
        if (!BASEMAPS[basemapKey]) {
            console.error(`Unknown basemap: ${basemapKey}`);
            return;
        }

        // Remove current basemap
        if (this.currentBasemap && this.basemapLayers[this.currentBasemap]) {
            this.map.removeLayer(this.basemapLayers[this.currentBasemap]);
        }

        // Add new basemap
        this.currentBasemap = basemapKey;
        this.map.addLayer(this.basemapLayers[basemapKey]);
    }

    /**
     * Get the basemap control
     */
    getControl() {
        const self = this;
        const control = L.Control.extend({
            options: { position: 'topright' },
            onAdd: (map) => {
                const container = L.DomUtil.create('div', 'basemap-switcher');
                container.setAttribute('role', 'group');
                container.setAttribute('aria-label', 'Basemap selector');

                const label = L.DomUtil.create('label', 'basemap-label', container);
                label.textContent = 'Maps:';
                label.style.display = 'block';
                label.style.fontSize = '11px';
                label.style.fontWeight = 'bold';
                label.style.marginBottom = '5px';
                label.style.color = '#333';

                Object.entries(BASEMAPS).forEach(([key, config]) => {
                    const btn = L.DomUtil.create('button', 'basemap-btn', container);
                    btn.innerHTML = `${config.icon} <span>${config.name}</span>`;
                    btn.dataset.basemap = key;
                    btn.title = config.name;
                    btn.setAttribute('aria-label', `Select ${config.name} basemap`);
                    
                    if (key === self.currentBasemap) {
                        btn.classList.add('active');
                    }

                    L.DomEvent.on(btn, 'click', (e) => {
                        L.DomEvent.stopPropagation(e);
                        self._switchBasemap(key, container);
                    });
                });

                return container;
            }
        });

        return new control();
    }

    /**
     * Switch to a different basemap
     */
    _switchBasemap(basemapKey, container) {
        this.setBasemap(basemapKey);
        container.querySelectorAll('.basemap-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        container.querySelector(`[data-basemap="${basemapKey}"]`).classList.add('active');
    }

    /**
     * Get current basemap key
     */
    getCurrentBasemap() {
        return this.currentBasemap;
    }
}
