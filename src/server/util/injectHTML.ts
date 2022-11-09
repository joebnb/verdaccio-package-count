import { Handler, NextFunction, Request, Response, static as expressServeStatic } from 'express';
import { readFileSync } from 'fs';
import path from 'path';

const publicRoot = path.join(__dirname, '../..', '/client');

const isDev = false;

/**
 * Injects additional tags into the DOM that modify the login button.
 */
export class InjectHtml {
    static readonly path = '/-/static/' + 'download-count';

    /**
     * Serves the injected style and script imports.
     */
    readonly serveAssetsMiddleware = expressServeStatic(publicRoot);

    private readonly scriptTag = `<script src="${InjectHtml.path}/assets/index.js"></script>`;
    private readonly styleTag = `<style>${readFileSync(`${publicRoot}/assets/index.css`)}</style>`;
    private readonly scriptDevTag = `<script type="module" src="//0.0.0.0:3000/@vite/client"></script>
    <script type="module">
        import RefreshRuntime from "//0.0.0.0:3000/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        console.log('current in download-count dev');
    </script>
    <script type="module" src="//0.0.0.0:3000/src/main.tsx" defer></script>
    `;

    private readonly headWithStyle = [this.styleTag, '</head>'].join('');
    private readonly bodyWithScript = [isDev ? this.scriptDevTag : this.scriptTag, '</body>'].join('');

    constructor(private readonly config) {}

    /**
     * Monkey-patches `res.send` in order to inject style and script imports.
     */
    injectAssetsMiddleware: Handler = (req: Request, res: Response, next: NextFunction) => {
        const send = res.send;
        res.send = (html) => {
            html = this.insertImportTags(html);
            return send.call(res, html);
        };
        next();
    };

    private insertImportTags = (html: string | Buffer): string => {
        html = String(html);
        if (!html.includes('__VERDACCIO_BASENAME_UI_OPTIONS')) {
            return html;
        }
        html = html.replace(/<\/head>/, this.headWithStyle);
        html = html.replace(/<\/body>/, this.bodyWithScript);
        return html;
    };
}
