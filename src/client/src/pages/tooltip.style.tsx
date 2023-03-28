import React from 'react';
import styled from 'styled-components';

export const Tips = styled.div<{ pos: any }>`
    position: absolute;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    width: auto;
    min-width: 180px;
    display: inline-block;
    white-space: pre-wrap;
    border-radius: 4px;
    padding: 4px 8px;
    z-index: 2;
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
