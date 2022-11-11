import { useState, useRef } from 'react';
import { throttle } from 'lodash-es';

import { Tips, Layer } from './overlay.style';

const thrott = throttle((callback) => {
    callback();
}, 20);
export const Overlay = ({ data }: { data: number[] | undefined }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState<{ x?: number; y?: number; visibility: 'visible' | 'hidden'; text?: string }>({
        x: 0,
        y: 0,
        visibility: 'hidden',
        text: '',
    });
    const onMouseMove = (evt: Event) => {
        thrott(() => {
            if (!ref.current) return;
            const x = (evt as any).nativeEvent?.layerX;
            const y = (evt as any).nativeEvent?.layerY;
            const width = (ref.current as HTMLElement).getBoundingClientRect().width;

            const dataLen = data?.length || 0;
            const index = Math.floor((Math.max(x, 0) / width) * dataLen);

            setPos({
                x: x - 80,
                y: y + 20,
                visibility: 'visible',
                text: `week:${dataLen - index} download:${(data || [])[index]}`,
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
