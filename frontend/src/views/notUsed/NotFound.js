import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found container">
            <h1>404!</h1>
            <p>
                What you're looking for is either protected or does not exist.
                <Link to="/">Return to home</Link>
            </p>
        </div>
    );
};

export default NotFound;