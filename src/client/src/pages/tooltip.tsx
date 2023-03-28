import { useState, useRef, useMemo } from 'react';
import { throttle } from 'lodash-es';

import { Tips, Layer } from './tooltip.style';

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
}

function calculateDate(date: number[]) {
    let weekLength = date?.length || 0;
    const today = new Date();
    const dateRanges = [];
    for (let i = weekLength; i > 0; i--) {
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7 * i - today.getDay() + 1);
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7 * i - today.getDay() + 7);

        dateRanges.push({
            start: formatDate(startOfWeek),
            end: formatDate(endOfWeek),
        });
    }
    return dateRanges;
}

const thrott = throttle((callback) => {
    callback();
}, 10);

export const Tooltip = ({ data }: { data: number[] | undefined }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState<{ x?: number; y?: number; visibility: 'visible' | 'hidden'; text?: string }>({
        x: 0,
        y: 0,
        visibility: 'hidden',
        text: '',
    });

    const dateList: { start: string; end: string }[] = useMemo(() => {
        return calculateDate(data || []);
    }, [data]);

    const onMouseMove = (evt: Event) => {
        thrott(() => {
            if (!ref.current) return;
            const x = (evt as any).nativeEvent?.layerX;
            const y = (evt as any).nativeEvent?.layerY;
            const width = (ref.current as HTMLElement).getBoundingClientRect().width;

            const dataLen = data?.length || 0;
            const index = Math.floor((Math.max(x, 0) / width) * dataLen);

            const currentWeek = dateList[index + 1] ? `${dateList[index + 1].start}-${dateList[index + 1].end}` : 'This week';

            setPos({
                x: x - 80,
                y: y + 20,
                visibility: 'visible',
                text: `${currentWeek} \nDownload: ${(data || [])[index]}`,
            });
        });
    };

    const onMouseOut = (evt: MouseEvent) => {
        setPos({
            visibility: 'hidden',
        });
    };

    return (
        <>
            <Layer ref={ref} onMouseMove={onMouseMove} onMouseOut={onMouseOut}></Layer>
            <Tips pos={pos}>{pos.text}</Tips>
        </>
    );
};
