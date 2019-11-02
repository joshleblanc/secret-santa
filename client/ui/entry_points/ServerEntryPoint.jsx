import React from 'react';
import { StaticRouter } from 'react-router-dom';
import Routes from '../components/Routes';
import Common from './Common';

export default ({location}) => {
    const context = {};
    return(
        <Common>
            <StaticRouter location={location} context={context}>
                <Routes />
            </StaticRouter>
        </Common>
    );
}
