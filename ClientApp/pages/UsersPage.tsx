import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { User, UserRouterProps, Utils } from '../models';
import { UserList, UserFilter } from '../components';

type UsersProps =
    RouteComponentProps<UserRouterProps>;

export class UsersPage extends React.Component<UsersProps, {}> {
    public render() {
        let get = Utils.get_from_location(this.props.location);
        //console.log('....', this.props.history, get);
        let back = encodeURIComponent(Utils.getCurrentUrl(this.props.location));

        return <div className="">
            <h1>Users</h1>

            <Link to={`/add?back=${back}`} className="btn btn-default">Добавить</Link>

            <UserFilter {...this.props.match.params} get={get} searchParams={this.props.location.search} history={this.props.history} />

            <UserList {...this.props.match.params} get={get} searchParams={this.props.location.search} back={back} />
            
        </div>;
    }
}

