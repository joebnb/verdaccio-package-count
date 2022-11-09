import { PluginConfig } from '../index.type';

import { Client } from '@elastic/elasticsearch';

let client, _config;
export function getElastic(config: PluginConfig): Client {
    if (client != undefined && _config === config) return client;
    _config = config;

    return (client = new Client({
        ...(config.middlewares['verdaccio-package-count'].elastic as any),
    }));
}
