import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { User, EditUserRouterProps, Utils } from '../models';
import { UserForm } from '../components';

type EditUsersProps =
    RouteComponentProps<EditUserRouterProps>;

export class EditUserPage extends React.Component<EditUsersProps, {}> {
    public render() {
        let back = '';
        let gets = Utils.get_from_location(this.props.location);
        if (typeof gets['back'] !== 'undefined')
            back = gets['back'];

        //console.log(back);
        return <div className="container1">
            <h1></h1>

            {Utils.checkRedirect(back, this.props.location) && back != null ? <Link to={back} className="btn btn-default">Назад</Link> : []}

            <UserForm userid={this.props.match.params.userid} history={this.props.history} back={back} />
            

        </div>;
    }
}

