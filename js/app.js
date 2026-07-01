/**
 * JKUAT Campus Map Application
 * Main entry point for the web mapping application
 */

import { MapCore } from './map-core.js';
import { MAP_CONFIG } from './map-config.js';
import { createBuildingsLayer, addFeatureHighlight } from './layers.js';
import { 
    initializeBasicControls, 
    initializeLayerControl,
    addScaleBar,
    addMousePosition,
    addFullscreenButton,
    addCenterButton,
    addZoomToLayerButton
} from './controls.js';
import { BasemapSwitcher } from './basemap-switcher.js';
import { initKeyboardNavigation } from './keyboard-nav.js';

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🗺️ Initializing JKUAT Campus Map...');

    // Initialize the map core
    const mapCore = new MapCore();
    const map = mapCore.initialize();

    // Add initial basemap
    mapCore.addBasemap();

    // Create basemap switcher
    const basemapSwitcher = new BasemapSwitcher(map, 'osm');
    basemapSwitcher.getControl().addTo(map);

    // Add GeoJSON layer (buildings)
    // Note: json_Buildings_1 is loaded from data/Buildings_1.js
    if (typeof window.json_Buildings_1 !== 'undefined') {
        const buildingsLayer = createBuildingsLayer(map, window.json_Buildings_1);
        mapCore.addLayer('buildings', buildingsLayer);

        // Add feature highlight on hover
        addFeatureHighlight(buildingsLayer);

        // Set up layer tree control
        const overlaysTree = [
            { label: '<img src="legend/Buildings_1.png" /> Buildings', layer: buildingsLayer },
        ];
        initializeLayerControl(map, overlaysTree);

        // Add zoom to buildings button
        addZoomToLayerButton(map, buildingsLayer, 'Buildings', 'topright');

        console.log('✅ Buildings layer loaded successfully');
    } else {
        console.warn('⚠️ Buildings data (json_Buildings_1) not found');
    }

    // Initialize controls
    initializeBasicControls(map);

    // Add advanced controls
    addScaleBar(map, 'bottomleft');
    addMousePosition(map, 'bottomright');
    addFullscreenButton(map, 'topright');
    addCenterButton(map, MAP_CONFIG.defaultCenter, 'topright');

    // Initialize keyboard navigation
    initKeyboardNavigation(map, MAP_CONFIG.initialBounds);

    // Expose map to global scope for debugging
    window.map = map;
    window.mapCore = mapCore;
    window.basemapSwitcher = basemapSwitcher;

    console.log('✅ JKUAT Campus Map initialized successfully');
    console.log('💡 Tip: Use arrow keys and +/- to navigate the map');
    console.log('💡 Tip: Press Home to reset to initial view');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
