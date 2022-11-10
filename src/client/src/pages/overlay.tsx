import React, { useState, useEffect, useRef } from 'react';
import { debounce, throttle } from 'lodash-es';

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
            const x = evt?.nativeEvent?.layerX;
            const y = evt?.nativeEvent?.layerY;
            const width = (ref.current as HTMLElement).getBoundingClientRect().width;

            const dataLen = data.length;
            const index = Math.floor((x / width) * dataLen);

            setPos({
                x: x - 80,
                y: y + 20,
                visibility: 'visible',
                text: `week:${dataLen - index} download:${data[index]}`,
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
