import { getVerisonFromUrl, getPackageAndVerison } from '../../src/server/util/packages';

const testCase = [
    ['/@cloud/cui/-/cui-1.1.0.tgz', '1.1.0', ['@cloud/cui', '1.1.0']],
    ['@cloud/cui/-/cui-1.1.0.tgz', '1.1.0', ['@cloud/cui', '1.1.0']],
    ['/cui/-/cui-1.1.0-alpha.tgz', '1.1.0-alpha', ['cui', '1.1.0-alpha']],
    ['cui/-/cui-1.1.0-alpha.tgz', '1.1.0-alpha', ['cui', '1.1.0-alpha']],
    ['/mirror/sad.tgz', undefined, ['mirror', undefined]],
    ['/@cloud/cui', undefined, ['@cloud/cui', undefined]],
    ['/@cloud/cui/latest', undefined, ['@cloud/cui', undefined]],
    ['//cui', undefined, ['cui', undefined]],
    ['@cloud/cui-asym/-/cui-asym-1.1.0.tgz', '1.1.0', ['@cloud/cui-asym', '1.1.0']],
    ['/vue/-/vue-3.2.44.tgz', '3.2.44', ['vue', '3.2.44']],
];

test('getVerisonFromUrl', () => {
    testCase.forEach(([condition, ver, both]) => {
        let version = getVerisonFromUrl(condition as string);
        expect(version).toEqual(ver);
    });
});

test('getPackageAndVerison', () => {
    testCase.forEach(([condition, ver, both]) => {
        let pkgAndVer = getPackageAndVerison(condition as string);
        expect(pkgAndVer).toEqual(both);
    });
});
