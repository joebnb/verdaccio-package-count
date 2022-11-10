import React from 'react';
import styled from 'styled-components';

export const Tips = styled.div<{ pos: { x: number; y: number; visibility: 'hidden' | 'visible'; text?: string } }>`
    position: absolute;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    width: auto;
    display: block;
    border-radius: 4px;
    padding: 4px 8px;
    left: ${({ pos }) => `${pos.x}px`};
    top: ${({ pos }) => `${pos.y}px`};
    visibility: ${({ pos }) => pos.visibility};
`;

interface Props extends React.PropsWithChildren {
    onMouseMove: React.MouseEventHandler<HTMLDivElement> & ((evt: MouseEvent) => void);
    onMouseOut: React.MouseEventHandler<HTMLDivElement> & ((evt: MouseEvent) => void);
}

export const Layer = styled.div<any>`
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;
