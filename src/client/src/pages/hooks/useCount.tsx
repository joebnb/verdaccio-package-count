import React, { useEffect } from 'react';
import { CountModel } from '../../../../server/index.type';
import { cache } from '../../utils/cache';

export function useCount(package_name: string) {
    const [count, setCount] = React.useState<CountModel>();
    useEffect(() => {
        fetch(`/-/analysis/${package_name}`)
            .then((d) => d.json())
            .then((data) => {
                if (data.error) {
                    console.log(data);
                } else {
                    setCount(data);
                    cache.set(package_name, data);
                }
            });
    }, []);
    return count;
}