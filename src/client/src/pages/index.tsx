import { useCount } from './hooks/useCount';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import { Tooltip } from './tooltip';
import { getPackageFromUrl, getDiffFromDate } from '../utils/index';

import { Container, Card, Title, ChartContainer, Overlay } from './index.style';

function App() {
    const packageInfo = location.pathname.replace('/-/web/detail/', '');
    const package_name = getPackageFromUrl(packageInfo) || '';

    const count = useCount(package_name);
    const updateAt = new Date(count?.update_at || '');
    const deltaDay = getDiffFromDate(new Date(), updateAt);

    return (
        <Container id='download-count-32d3'>
            <Title>Downloads</Title>
            <ChartContainer>
                {deltaDay > 7 ? (
                    <Overlay>
                        <div>
                            <div>No download record recent week.</div>
                            <div>Last update was: {updateAt.toLocaleDateString()}</div>
                        </div>
                    </Overlay>
                ) : null}
                <Tooltip data={count?.trend}></Tooltip>
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
