/**
 * Layers Module
 * Handles GeoJSON layer creation, styling, and popups
 */

const autolinker = new Autolinker({ truncate: { length: 30, location: 'smart' } });

/**
 * Remove empty rows from popup content
 */
function removeEmptyRowsFromPopupContent(content, feature) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const rows = tempDiv.querySelectorAll('tr');
    
    for (let i = rows.length - 1; i >= 0; i--) {
        const td = rows[i].querySelector('td.visible-with-data');
        const key = td ? td.id : '';
        if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
            rows[i].parentNode.removeChild(rows[i]);
        }
    }
    
    return tempDiv.innerHTML;
}

/**
 * Add media class to popup if it contains images
 */
function addClassToPopupIfMedia(content, popup) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    if (tempDiv.querySelector('td img')) {
        popup._contentNode.classList.add('media');
        // Delay to force redraw
        setTimeout(() => {
            popup.update();
        }, 10);
    } else {
        popup._contentNode.classList.remove('media');
    }
}

/**
 * Create Buildings GeoJSON layer
 */
export function createBuildingsLayer(mapInstance, geoJsonData) {
    const paneId = 'pane_Buildings_1';
    
    // Create pane
    mapInstance.createPane(paneId);
    mapInstance.getPane(paneId).style.zIndex = 401;
    mapInstance.getPane(paneId).style['mix-blend-mode'] = 'normal';

    /**
     * Style function for buildings
     */
    function getStyle() {
        return {
            pane: paneId,
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0,
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(243,166,178,1.0)',
            interactive: true
        };
    }

    /**
     * Create popup content
     */
    function createPopupContent(feature) {
        return `<table>
            <tr>
                <th scope="row">fid</th>
                <td>${feature.properties['fid'] !== null ? autolinker.link(String(feature.properties['fid']).replace(/'/g, '&#39;').toLocaleString()) : ''}</td>
            </tr>
            <tr>
                <th scope="row">Facility name</th>
                <td>${feature.properties['Facility name'] !== null ? autolinker.link(String(feature.properties['Facility name']).replace(/'/g, '&#39;').toLocaleString()) : ''}</td>
            </tr>
            <tr>
                <th scope="row">Owner/operator</th>
                <td>${feature.properties['Owner/operator'] !== null ? autolinker.link(String(feature.properties['Owner/operator']).replace(/'/g, '&#39;').toLocaleString()) : ''}</td>
            </tr>
            <tr>
                <th scope="row">Capacity/operational characteristics</th>
                <td>${feature.properties['Capacity/operational characteristics'] !== null ? autolinker.link(String(feature.properties['Capacity/operational characteristics']).replace(/'/g, '&#39;').toLocaleString()) : ''}</td>
            </tr>
            <tr>
                <th scope="row">Type of facility</th>
                <td>${feature.properties['Type of facity'] !== null ? autolinker.link(String(feature.properties['Type of facity']).replace(/'/g, '&#39;').toLocaleString()) : ''}</td>
            </tr>
        </table>`;
    }

    /**
     * On each feature callback
     */
    function onEachFeature(feature, layer) {
        const content = removeEmptyRowsFromPopupContent(createPopupContent(feature), feature);
        
        layer.on('popupopen', (e) => {
            addClassToPopupIfMedia(content, e.popup);
        });
        
        layer.bindPopup(content, { maxHeight: 400 });
        
        // Add tooltip
        layer.bindTooltip(
            `<div style="color: #323232; font-size: 10pt; font-family: 'Open Sans', sans-serif;">${feature.properties['Facility name'] || 'Building'}</div>`,
            { sticky: true, permanent: false }
        );
    }

    // Create GeoJSON layer
    const layer = L.geoJson(geoJsonData, {
        attribution: '',
        interactive: true,
        pane: paneId,
        style: getStyle,
        onEachFeature: onEachFeature
    });

    mapInstance.addLayer(layer);
    return layer;
}

/**
 * Add feature highlight on hover
 */
export function addFeatureHighlight(layer, highlightStyle = {}) {
    const defaultHighlightStyle = {
        weight: 3,
        color: '#FF6B6B',
        dashArray: '',
        fillOpacity: 0.9
    };

    const style = { ...defaultHighlightStyle, ...highlightStyle };

    layer.on('mouseover', (e) => {
        const layer = e.target;
        layer.setStyle(style);
        layer.bringToFront();
    });

    layer.on('mouseout', (e) => {
        layer.resetStyle(e.target);
    });
}
