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
