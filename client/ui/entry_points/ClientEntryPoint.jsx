import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from '../components/Routes';
import Common from '../entry_points/Common';

export default () => {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);
    return(
        <Common>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </Common>
    )
}
