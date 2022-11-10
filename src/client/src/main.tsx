import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/index';
import './main.css';
import { replaceVersion } from './utils/version-repace';

const MOUNT_POINT = 'download-count-root';

function render() {
    setInterval(() => {
        const flagNode = document.getElementById('download-count-32d3');
        const mountPoint = document.getElementsByClassName('detail-info')[0];

        if (mountPoint && !flagNode) {
            const node = document.createElement('div');
            node.id = MOUNT_POINT;
            mountPoint.appendChild(node);

            ReactDOM.createRoot(document.getElementById(MOUNT_POINT)!).render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            );
        }
    }, 500);
}
render();
replaceVersion();
