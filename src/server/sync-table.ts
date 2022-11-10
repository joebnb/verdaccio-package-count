import { getElastic } from './util/elastic';
import { getWeekIndex } from './util/date';
import { countScript } from './util/scripts';

import { PluginConfig, CountModel, SyncPackageMapItem, MiddlewareConfig, SyncMap } from './index.type';

export const count_index = 'npm_analysis_packages';
export const script_id = 'npm_analysis_package_count';
export class SyncTable {
    config: PluginConfig;
    middlewareConfig: MiddlewareConfig;
    filter: RegExp[];
    private syncMap: SyncMap = {};

    constructor(config: PluginConfig) {
        this.config = config;
        this.middlewareConfig = this.config.middlewares['verdaccio-package-count'];
        this.initScript();
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
        setInterval(async () => {
            // Object.values(this.syncMap).forEach((item) => {
            //     this.update(item, now);
            // });
            this.bulkUpdate(this.syncMap, new Date());
        }, 6000 || 120 * 1000);
    }

    async bulkUpdate(syncMap: SyncMap, nowDate: Date) {
        const elastic = getElastic(this.config);
        const operations = Object.values(syncMap).flatMap((item): [{ update: any }, any] => {
            return [
                { update: { _index: count_index, _id: item.name } },
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
                        trend: [...new Array(59).fill(0), item.count],
                        versions: item.versions || {},
                        update_at: nowDate.toISOString(),
                    },
                },
            ];
        });

        if (!operations.length) return;

        try {
            await elastic.bulk({ refresh: true, operations: operations });
        } catch (e) {
            console.error(e);
        }
        this.syncMap = {};
    }

    async update(package_count: SyncPackageMapItem, nowDate: Date) {
        const elastic = getElastic(this.config);
        try {
            const data = await elastic.getSource<CountModel>({
                index: count_index,
                id: package_count.name,
            });

            Object.entries(package_count.versions).forEach(([version, count]) => {
                data.versions[version] += count;
            });

            const dataDate = new Date(data.update_at);

            const this_week = getWeekIndex(dataDate.getTime()) == getWeekIndex() ? data.this_week + package_count.count : package_count.count;
            let trend = data.trend || [...new Array(29).fill(0), 1];
            // if week not same add new week
            getWeekIndex(dataDate.getTime()) == getWeekIndex() && trend.pop();
            trend.push(this_week);
            trend.splice(0, trend.length - 24);

            // if mouth or year change, year and mouth should flush
            await elastic.index<CountModel>({
                index: count_index,
                id: package_count.name,
                document: {
                    total: data.total + package_count.count,
                    this_year: dataDate.getFullYear() == nowDate.getFullYear() ? data.this_year + package_count.count : package_count.count,
                    this_month: dataDate.getMonth() == nowDate.getMonth() ? data.this_month + package_count.count : package_count.count,
                    this_week: this_week,
                    trend,
                    package_name: package_count.name,
                    versions: { ...data.versions },
                    update_at: nowDate.toISOString(),
                },
            });
            delete this.syncMap[package_count.name];
        } catch (error) {
            if (JSON.stringify(error).indexOf('not_found_exception') != -1) {
                let originData = {
                    index: count_index,
                    id: package_count.name,
                    document: {
                        package_name: package_count.name,
                        this_month: 1,
                        this_year: 1,
                        this_week: 1,
                        total: 1,
                        trend: [...new Array(29).fill(0), 1],
                        versions: package_count.versions,
                        update_at: Date.now(),
                    },
                };
                await elastic.index<CountModel>(originData);
            }
            console.error(error);
        }

        // flush them even it's report error we must accept this
        delete this.syncMap[package_count.name];
    }

    async query(package_name: string) {
        const elastic = getElastic(this.config);
        try {
            return await elastic.getSource({
                index: count_index,
                id: package_name,
            });
        } catch (error) {
            console.error(error);
            if (JSON.stringify(error).indexOf('not_found_exception')) return { error: 'no_record' };

            return { error: error?.name || 'unknow error but catched' };
        }
    }
}
