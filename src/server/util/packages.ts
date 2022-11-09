export function getPackageFromUrl1(url_path: string) {
    url_path = url_path.replace(/^\/+/, '');

    const haveScope = url_path[0] == '@';
    const packageName = url_path
        .split('/')
        .slice(0, haveScope ? 2 : 1)
        .join('/');

    if (packageName) {
        return packageName;
    }
}

export function getPackageFromUrl(url_path: string) {
    url_path = url_path.replace(/^\/+/, '');

    const packageName = url_path.split('/-/').shift();

    if (packageName) {
        return packageName;
    }
}

export function getVerisonFromUrl(url_path: string) {
    if (!/.tgz$/.test(url_path)) {
        return;
    }
    const [packageStr, versionStr] = url_path.split('/-/');
    if (!packageStr) return;

    const name = packageStr.split('/').pop() || '';
    const version = versionStr?.replace(`${name}-`, '').replace(/\.tgz$/, '');

    return version;
}

export function getPackageAndVerison(url_path: string): [string | undefined, string | undefined] {
    const package_name = getPackageFromUrl(url_path);
    const version = getVerisonFromUrl(url_path);
    return [package_name, version];
}
