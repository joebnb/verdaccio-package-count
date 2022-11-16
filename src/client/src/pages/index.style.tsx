import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    margin: 8px 0;
    position: relative;
`;

export const Card = styled.div`
    display: flex;
    justify-content: space-between;
    flex: 1;
`;

export const ToolTipContainer = styled.div<{ x: number; y: number }>`
    display: flex;
    background-color: #333;
    color: #fff;
    width: 200px;
    height: 32px;
    position: absolute;
    left: ${({ x }) => x}px;
    top: ${({ y }) => y}px;
`;

export const Title = styled.div`
    font-size: 1rem;
    font-weight: 700;
`;

export const ChartContainer = styled.div`
    position: relative;
    display: flex;
    flex:1;
`;


export const Overlay = styled.div`
pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(120,120,120,0.6);
    color:#fff;
    border-radius: 3px;
`