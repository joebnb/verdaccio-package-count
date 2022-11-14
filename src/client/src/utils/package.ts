export function getPackageFromUrl(url_path: string) {
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