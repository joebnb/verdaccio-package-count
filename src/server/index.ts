import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Application } from 'express';
// import cookieParser from 'cookie-parser';

import { InjectHtml } from './util/injectHTML';
import { CountNPM } from './count-npm';

import { PluginConfig } from './index.type';

export default class VerdaccioMiddlewarePlugin implements IPluginMiddleware<PluginConfig> {
    public logger: Logger;
    public config: PluginConfig;
    public constructor(config: PluginConfig, options: PluginOptions<PluginConfig>) {
        this.logger = options.logger;
        this.config = config;
    }

    public register_middlewares(
        app: Application,
        auth: IBasicAuth<PluginConfig>,
        /* eslint @typescript-eslint/no-unused-vars: off */
        _storage: IStorageManager<PluginConfig>
    ): void {
        if (!this?.config?.enable) {
            return;
        }

        const injectHTML = new InjectHtml(this.config);
        const countNPM = new CountNPM(this.config);

        // inject js
        app.use(injectHTML.injectAssetsMiddleware);
        app.use(InjectHtml.path, injectHTML.serveAssetsMiddleware);
        // get request
        app.use(countNPM.middleWare);
    }
}
