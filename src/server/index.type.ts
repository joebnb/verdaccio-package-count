import { Config } from '@verdaccio/types';

export const pluginName = 'verdaccio-package-count';

export interface MiddlewareConfig {
    enable: boolean;
    filter?: RegExp[];
    sync_interval?: number;
    elastic: {
        cloud?: string;
        node?: string;
        auth?: {
            apiKey?: string;
            username?: string;
            password?: string;
        };
        tls?: {
            rejectUnauthorized: boolean;
        };
    };
}

export interface PluginConfig extends Config {
    middlewares: {
        [pluginName]: MiddlewareConfig;
    };
}

export interface SyncPackageMapItem {
    name: string;
    count: number;
    versions: {
        [version: string]: number;
    };
}

export interface CountModel {
    package_name: string;
    total: number;
    this_year: number;
    this_month: number;
    this_week: number;
    trend: number[];
    versions: {
        [version: string]: number;
    };
    update_at: number;
}
