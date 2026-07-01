/**
 * Controls Module
 * Handles initialization of map controls
 */

/**
 * Initialize basic map controls (zoom, locate)
 */
export function initializeBasicControls(mapInstance) {
    // Zoom control
    const zoomControl = L.control.zoom({
        position: 'topleft'
    }).addTo(mapInstance);

    // Locate control (GPS) - note: requires https or localhost
    try {
        L.control.locate({
            locateOptions: { maxZoom: 19 },
            position: 'topleft'
        }).addTo(mapInstance);
    } catch (e) {
        console.warn('Locate control failed to initialize:', e);
    }

    return { zoomControl };
}

/**
 * Initialize layer control
 */
export function initializeLayerControl(mapInstance, overlaysTree) {
    const layerControl = L.control.layers.tree(null, overlaysTree, {
        collapsed: true,
        position: 'topright'
    });
    
    layerControl.addTo(mapInstance);
    return layerControl;
}

/**
 * Add scale bar to map
 */
export function addScaleBar(mapInstance, position = 'bottomleft') {
    L.control.scale({
        position: position,
        metric: true,
        imperial: true
    }).addTo(mapInstance);
}

/**
 * Add mouse position indicator
 */
export function addMousePosition(mapInstance, position = 'bottomright') {
    const control = L.Control.extend({
        options: { position: position },
        onAdd: (map) => {
            const div = L.DomUtil.create('div', 'leaflet-control mouse-position');
            div.style.background = 'white';
            div.style.padding = '5px 10px';
            div.style.borderRadius = '4px';
            div.style.fontSize = '11px';
            div.style.fontFamily = 'monospace';
            div.style.boxShadow = '0 3px 14px rgba(0, 0, 0, 0.15)';
            div.innerHTML = 'Lat: --, Lng: --';

            map.on('mousemove', (e) => {
                div.innerHTML = `Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`;
            });

            return div;
        }
    });

    return new control().addTo(mapInstance);
}

/**
 * Add fullscreen button
 */
export function addFullscreenButton(mapInstance, position = 'topright') {
    const control = L.Control.extend({
        options: { position: position },
        onAdd: (map) => {
            const btn = L.DomUtil.create('button', 'leaflet-control fullscreen-btn');
            btn.innerHTML = '⛶';
            btn.title = 'Toggle fullscreen';
            btn.setAttribute('aria-label', 'Toggle fullscreen mode');
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.background = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '18px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.boxShadow = '0 3px 14px rgba(0, 0, 0, 0.15)';
            btn.style.transition = 'all 0.2s ease';
            btn.style.marginBottom = '5px';

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                const mapContainer = map.getContainer();
                if (!document.fullscreenElement) {
                    mapContainer.requestFullscreen?.() ||
                    mapContainer.webkitRequestFullscreen?.() ||
                    mapContainer.mozRequestFullScreen?.() ||
                    mapContainer.msRequestFullscreen?.();
                    btn.style.background = '#4CAF50';
                    btn.style.color = 'white';
                } else {
                    document.exitFullscreen?.() ||
                    document.webkitExitFullscreen?.() ||
                    document.mozCancelFullScreen?.() ||
                    document.msExitFullscreen?.();
                    btn.style.background = 'white';
                    btn.style.color = 'black';
                }
            });

            return btn;
        }
    });

    return new control().addTo(mapInstance);
}

/**
 * Add center map button
 */
export function addCenterButton(mapInstance, center, position = 'topright') {
    const control = L.Control.extend({
        options: { position: position },
        onAdd: (map) => {
            const btn = L.DomUtil.create('button', 'leaflet-control center-btn');
            btn.innerHTML = '🎯';
            btn.title = 'Center map on campus';
            btn.setAttribute('aria-label', 'Center map on campus');
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.background = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '18px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.boxShadow = '0 3px 14px rgba(0, 0, 0, 0.15)';
            btn.style.transition = 'all 0.2s ease';

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                map.setView(center, map.getZoom(), { animate: true });
            });

            L.DomEvent.on(btn, 'mouseover', () => {
                btn.style.background = '#f0f0f0';
                btn.style.transform = 'scale(1.05)';
            });

            L.DomEvent.on(btn, 'mouseout', () => {
                btn.style.background = 'white';
                btn.style.transform = 'scale(1)';
            });

            return btn;
        }
    });

    return new control().addTo(mapInstance);
}

/**
 * Add zoom to layer button
 */
export function addZoomToLayerButton(mapInstance, layer, layerName, position = 'topright') {
    const control = L.Control.extend({
        options: { position: position },
        onAdd: (map) => {
            const btn = L.DomUtil.create('button', 'leaflet-control zoom-layer-btn');
            btn.innerHTML = `🔍`;
            btn.title = `Zoom to ${layerName}`;
            btn.setAttribute('aria-label', `Zoom to ${layerName} layer`);
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.background = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '18px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.boxShadow = '0 3px 14px rgba(0, 0, 0, 0.15)';
            btn.style.transition = 'all 0.2s ease';
            btn.style.marginTop = '5px';

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50], animate: true });
                }
            });

            L.DomEvent.on(btn, 'mouseover', () => {
                btn.style.background = '#f0f0f0';
                btn.style.transform = 'scale(1.05)';
            });

            L.DomEvent.on(btn, 'mouseout', () => {
                btn.style.background = 'white';
                btn.style.transform = 'scale(1)';
            });

            return btn;
        }
    });

    return new control().addTo(mapInstance);
}
