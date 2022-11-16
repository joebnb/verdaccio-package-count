import { useCount } from './hooks/useCount';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import { Overlay } from './overlay';
import { getPackageFromUrl } from '../utils/package';

import { Container, Card, Title, ChartContainer } from './index.style';

function App() {
    const packageInfo = location.pathname.replace('/-/web/detail/', '');
    const package_name = getPackageFromUrl(packageInfo) || '';

    const count = useCount(package_name);

    return (
        <Container id='download-count-32d3'>
            <Title>Downloads</Title>
            <ChartContainer>
                <Overlay data={count?.trend}></Overlay>
                <Sparklines data={count?.trend}>
                    <SparklinesLine color='#41c3f9' />
                </Sparklines>
            </ChartContainer>

            <Card>
                <div>This week:</div>
                <div>{count?.this_week || 'N/A'}</div>
            </Card>
            <Card>
                <div>This month:</div>
                <div>{count?.this_month || 'N/A'}</div>
            </Card>
            <Card>
                <div>This year</div>
                <div>{count?.this_year || 'N/A'}</div>
            </Card>
            <Card>
                <div>Total:</div>
                <div>{count?.total || 'N/A'}</div>
            </Card>
        </Container>
    );
}

export default App;
