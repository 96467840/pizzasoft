import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

type Error404Props =
    RouteComponentProps<{}>;

export class Error404Page extends React.Component<Error404Props, {}> {
    public render() {
        return <div>
            <h1>Ooops 404!</h1>
            ....

        </div>;
    }
}

