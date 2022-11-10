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
            Array.from(versionItems).forEach((item: HTMLElement) => {
                const currentVersion = item.childNodes[0].textContent || '';
                if (currentVersion && data.versions[currentVersion]) {
                    const div = document.createElement('div');
                    div.style.opacity = '0.7';
                    div.style.position = 'absolute';
                    div.style.left = '50%';
                    div.innerText = `Total: ${data.versions[currentVersion]}`;
                    div.className = 'npm-version-count';
                    (item as any).style = 'position:relative';
                    item.append(div);
                }
            });
        }, 500);
    };
}
