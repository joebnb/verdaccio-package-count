import { Request, Response, NextFunction } from 'express';

import { getPackageAndVerison } from './util/packages';
import { SyncTable } from './sync-table';

import { PluginConfig, MiddlewareConfig } from './index.type';

export { count_index } from './sync-table';
export class CountNPM {
    config: PluginConfig;
    middlewareConfig: MiddlewareConfig;
    filter: RegExp[];
    syncTable: SyncTable;

    constructor(config: PluginConfig) {
        this.config = config;
        this.middlewareConfig = this.config.middlewares['verdaccio-package-count'];
        this.syncTable = new SyncTable(config);
        this.initFilter();
    }

    private initFilter() {
        const costumeFilter = this.config?.middlewares['verdaccio-package-count'].filter || [];
        const defaultFilters = [/^\/-\//, /^\/favicon\.ico/];
        this.filter = [...defaultFilters, ...costumeFilter];
    }

    private isFiltedPath(url_path: string) {
        return this.filter.some((item: RegExp) => {
            return item.test(url_path);
        });
    }

    middleWare = (req: Request, res: Response, next: NextFunction) => {
        const decode_path = decodeURIComponent(req.path);
        if (decode_path.indexOf('/-/analysis') == 0) {
            const package_name = decode_path.replace(/^\/-\/analysis\//, '');
            return this.syncTable.queryDatabase(package_name).then((result) => res.json(result));
        }

        // count data
        const isFilted = this.isFiltedPath(decode_path);

        if (isFilted) return next();

        const [package_name, version] = getPackageAndVerison(decode_path);
        if (!package_name) return next();

        this.syncTable.countPackage(package_name, version);
        next();
    };
}
