import { cache } from '../utils/cache';
export function replaceVersion() {
    document.onclick = (evt) => {
        if (location.pathname.indexOf('/-/web/detail/') != 0) return;

        const package_name = location.pathname.replace('/-/web/detail/', '');
        const data = cache.get(package_name);
        setTimeout(() => {
            const versionItems = document.getElementsByClassName('version-item');
            const isRenderd = !!document.getElementsByClassName('npm-version-count').length;
            if (isRenderd) return;
            Array.from(versionItems).forEach((item) => {
                const currentVersion = item?.childNodes[0]?.textContent || '';
                if (currentVersion && data?.versions[currentVersion]?.length) {
                    const div = document.createElement('div');
                    div.style.color = '#999';
                    div.style.position = 'absolute';
                    div.style.left = '50%';
                    div.innerText = `Last 7 days: ${data?.versions[currentVersion]?.reduce((result: number, item: number) => (result || 0) + item)}`;
                    div.className = 'npm-version-count';
                    (item as any).style = 'position:relative';
                    item.append(div);
                }
            });
        }, 500);
    };
}
