import React from 'react';
import Flexbox from 'flexbox-react';

const VerticalCentered = (props) => {
    return (
        <Flexbox flexDirection="column" minHeight="100%">
            <Flexbox flexGrow={1}>
            </Flexbox>
            <Flexbox flexGrow={0}>
                {props.children}
            </Flexbox>
            <Flexbox flexGrow={1}>
            </Flexbox>
        </Flexbox>
    );
};

export default VerticalCentered;