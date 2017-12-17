import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';

import { User, UserOrders, UserRouterProps, Utils } from '../models';

interface UserListState {
    filteredUsers: Array<User>;
    searchParams: string;
}

type UserListProps =
    ApplicationState
    & UserRouterProps
    & typeof UsersStore.actionCreators;

class UserList extends React.Component<UserListProps, UserListState> {
    constructor(props: UserListProps) {
        super(props);
        this.state = this.getStateFromProps(props);
    }
    private getStateFromProps(props: UserListProps): UserListState {
        let order = typeof props.get['order'] !== 'undefined' ? props.get['order'] : '';
        if (UserOrders.findIndex((item) => { return (item.order == order); }) < 0) order = UserOrders[0].order;

        return {
            filteredUsers: props.users.items.filter((item: User) => {
                let get = props.get;
                if (/*typeof get['isArchive'] !== 'undefined' &&*/ get['isArchive'] == '1') {
                    if (!item.isArchive) return false;
                } else {
                    if (item.isArchive) return false;
                }
                if (typeof get['role'] !== 'undefined') {
                    if (item.role != get['role']) return false;
                }
                return true;
            }).sort((a: User, b: User) => {
                // никаких лишних проверок так как эта функция под нагрузкой
                let tmp = order.split(':', 2);
                let direction = tmp[1] == 'asc' ? 1 : -1;

                if (tmp[0] == 'id') {
                    if (a.id < b.id) { //a меньше b по некоторому критерию сортировки
                        return -1 * direction;
                    }
                    if (a.id > b.id) { // a больше b по некоторому критерию сортировки
                        return 1 * direction;
                    }
                    // a должно быть равным b
                    return 0;
                }
                if (tmp[0] == 'name') {
                    if (a.name < b.name) { //a меньше b по некоторому критерию сортировки
                        return -1 * direction;
                    }
                    if (a.name > b.name) { // a больше b по некоторому критерию сортировки
                        return 1 * direction;
                    }
                    // a должно быть равным b
                    return 0;
                }
                if (tmp[0] == 'birthday') {
                    // не эффективно! в теории дату надо переформатировать и хранить в сортируемом порядке в самом объекте
                    let abirthday = a.birthday.split('.').reverse().join('.');
                    let bbirthday = b.birthday.split('.').reverse().join('.');
                    if (abirthday < bbirthday) { //a меньше b по некоторому критерию сортировки
                        return -1 * direction;
                    }
                    if (abirthday > bbirthday) { // a больше b по некоторому критерию сортировки
                        return 1 * direction;
                    }
                    // a должно быть равным b
                    return 0;
                }
                return 0;
            }),
            searchParams: props.searchParams
        }
    }

    componentWillReceiveProps(nextProps: UserListProps) {
        // фильтруем список тока если поменялось что-то в гет параметрах
        if (this.state.searchParams == nextProps.searchParams) return;
        this.setState(this.getStateFromProps(nextProps));
    }

    private renderPagination() {
        let count = this.state.filteredUsers.length;
        let onPage = this.props.users.itemsOnPage;
        let pagesCount = count / onPage;
        if (pagesCount <= 1) return null;
        let pages: Array<JSX.Element> = [];

        let start: number = parseInt(this.props.start || '0') || 0;
        for (let i = 0; i < pagesCount; i++) {
            pages.push(<li key={i} className={start == i * onPage ? 'active' : ''}><Link to={Utils.UsersUrl(i * onPage, this.props.searchParams)}>{i + 1}</Link></li>);
        }

        return <ul className="pagination">{pages}</ul>;
    }

    public render() {
        let onPage = this.props.users.itemsOnPage;
        let start: number = parseInt(this.props.start || '0') || 0;

        return <div className="user-list">
            {
                this.state.filteredUsers.map((item, index) => {
                    if (index < start) return;
                    if (index >= (start + onPage)) return;
                    return <div key={item.id} className="row">
                        <div className="col-xs-2 col-sm-1">{item.id} {item.isArchive?'A':''} </div>
                        <div className="col-xs-10 col-sm-4">{item.name}</div>

                        <div className="col-xs-2 col-sm-1">{item.role}</div>
                        <div className="col-xs-4 col-sm-2">{item.birthday}</div>
                        <div className="col-xs-6 col-sm-4">{item.phone}</div>
                        
                    </div>;

                })
            }
            {this.renderPagination()}
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect<any, any, UserRouterProps>(
    (state: ApplicationState) => state, // Selects which state properties are merged into the component's props
    UsersStore.actionCreators                 // Selects which action creators are merged into the component's props
)(UserList);
