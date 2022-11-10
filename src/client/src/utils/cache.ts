class GlobalCache {
    private _cache: {
        [key: string]: any;
    };

    constructor() {
        this._cache = {};
    }

    set(key: string, data: any) {
        this._cache[key] = data;
    }

    get(key: string) {
        return this._cache[key];
    }

    clear() {
        this._cache = {};
    }

    has(key: string) {
        return this._cache[key] != undefined;
    }
}

export const cache = new GlobalCache();
