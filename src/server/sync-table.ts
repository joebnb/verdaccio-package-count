import { getElastic } from './util/elastic';
import { countScript, INDEX_MAPPING } from './util/scripts';

import { PluginConfig, MiddlewareConfig, SyncMap } from './index.type';

export const script_id = '_npm_analysis_package_count';
export class SyncTable {
    config: PluginConfig;
    middlewareConfig: MiddlewareConfig;
    filter: RegExp[];
    private syncMap: SyncMap = {};
    count_index: string;

    constructor(config: PluginConfig) {
        this.config = config;
        this.middlewareConfig = this.config.middlewares['verdaccio-package-count'];
        this.count_index = this.config.middlewares['verdaccio-package-count']?.es_index || 'npm_analysis_packages';
        this.initScript();
        this.initIndex();
        this.syncSchedule();
    }

    async initScript() {
        const elastic = getElastic(this.config);
        try {
            await elastic.putScript({
                id: script_id,
                script: {
                    lang: 'painless',
                    source: countScript(),
                },
            });
        } catch (error) {
            console.error(error);
        }
    }

    async initIndex() {
        const elastic = getElastic(this.config);
        try {
            await elastic.indices.putMapping({ index: this.count_index, properties: INDEX_MAPPING.properties as any });
            console.log('[package count]INDEX REFRESHED');
        } catch (error) {
            await elastic.indices.create({
                index: this.count_index,
                mappings: INDEX_MAPPING as any,
                settings: { refresh_interval: `${this.middlewareConfig.sync_interval}ms` || '600s' },
            });
            console.log('[package count]INDEX CREATED');
        }
    }

    countPackage(package_name, version) {
        this.syncMap['_total'] ||= { count: 0, name: '_total', versions: {} };
        this.syncMap['_total'].count++;

        this.syncMap[package_name] ||= {
            name: package_name,
            count: 0,
            versions: {},
        };
        this.syncMap[package_name].count++;

        if (version) {
            this.syncMap[package_name].versions[version] ||= 0;
            this.syncMap[package_name].versions[version]++;
        }
    }

    private syncSchedule() {
        setInterval(async () => this.bulkUpdate(this.syncMap, new Date()), this.middlewareConfig.sync_interval || 600 * 1000);
    }

    async bulkUpdate(syncMap: SyncMap, nowDate: Date) {
        const elastic = getElastic(this.config);
        const operations = Object.values(syncMap).flatMap((item): [{ update: any }, any] => {
            let upsertVersions = {};
            Object.keys(item.versions || {}).map((key, index) => {
                upsertVersions[key] = [...new Array(6).fill(0), item.versions[key]];
            });

            return [
                { update: { _index: this.count_index, _id: item.name } },
                {
                    script: {
                        id: script_id,
                        params: {
                            package_name: item.name,
                            count: item.count,
                            versions: item.versions,
                            update_at: nowDate.toISOString(),
                        },
                    },
                    upsert: {
                        package_name: item.name,
                        total: item.count,
                        this_year: item.count,
                        this_month: item.count,
                        this_week: item.count,
                        today: item.count,
                        trend: [...new Array(59).fill(0), item.count],
                        versions: upsertVersions || {},
                        update_at: nowDate.toISOString(),
                    },
                },
            ];
        });

        if (!operations.length) return;

        try {
            await elastic.bulk({ operations: operations });
        } catch (e) {
            console.error(e);
        }
        this.syncMap = {};
    }

    async query(package_name: string) {
        const elastic = getElastic(this.config);
        try {
            return await elastic.getSource({
                index: this.count_index,
                id: package_name,
            });
        } catch (error) {
            console.error(error);
            if (JSON.stringify(error).indexOf('not_found_exception')) return { error: 'no_record' };

            return { error: error?.name || 'unknow error but catched' };
        }
    }
}
