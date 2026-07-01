/**
 * Keyboard Navigation Module
 * Provides keyboard shortcuts for map navigation
 */

export function initKeyboardNavigation(map, initialBounds) {
    const panDistance = 100;
    const zoomDelta = 1;

    document.addEventListener('keydown', (e) => {
        // Prevent navigation when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'arrowup':
                map.panBy([0, panDistance]);
                e.preventDefault();
                break;
            case 'arrowdown':
                map.panBy([0, -panDistance]);
                e.preventDefault();
                break;
            case 'arrowleft':
                map.panBy([panDistance, 0]);
                e.preventDefault();
                break;
            case 'arrowright':
                map.panBy([-panDistance, 0]);
                e.preventDefault();
                break;
            case '+':
            case '=':
                map.zoomIn(zoomDelta);
                e.preventDefault();
                break;
            case '-':
            case '_':
                map.zoomOut(zoomDelta);
                e.preventDefault();
                break;
            case 'home':
                if (initialBounds) {
                    map.fitBounds(initialBounds, { padding: [50, 50], animate: true });
                }
                e.preventDefault();
                break;
        }
    });
}

export const KEYBOARD_SHORTCUTS = {
    'Arrow Up': 'Pan map north',
    'Arrow Down': 'Pan map south',
    'Arrow Left': 'Pan map west',
    'Arrow Right': 'Pan map east',
    '+ or =': 'Zoom in',
    '- or _': 'Zoom out',
    'Home': 'Reset to initial view'
};
