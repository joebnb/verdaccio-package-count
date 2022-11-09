import { getElastic } from '../../src/server/util/elastic';
import { count_index } from '../../src/server/count-npm';

const data = {
    index: count_index,
    id: 'test',
    document: {
        package_name: 'test',
        total: 100,
        this_year: 90,
        this_month: 29,
        versions: {
            '3.3.1': 13,
            '2.4.1': 9,
        },
    },
};

test('getElastic', async () => {
    const elastic = getElastic({
        middlewares: {
            'verdaccio-package-count': {
                enable: true,
                sync_interval: 6000,
                elastic: {
                    node: 'https://localhost:9200',
                    auth: {
                        apiKey: 'Zi1VeVdvUUJNa1RyYWRRZmo2TXc6Qi1tZ1ZTV3dSVldXSldCQVdEejVmdw==',
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                },
            },
        },
    } as any);
    await elastic.index(data);
    let result = await elastic.getSource({
        index: data.index,
        id: data.document.package_name,
    });

    expect(result).toHaveProperty('package_name');
    try {
        result = await elastic.getSource({
            index: data.index,
            id: 'not_existvalue',
        });
    } catch (e) {
        expect(JSON.stringify(e)).toContain('resource_not_found_exception');
    }
});
