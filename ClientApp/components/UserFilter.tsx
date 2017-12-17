import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { History } from 'history';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';

import { User, UserRoles, UserOrders, UserRouterProps, Utils, Hash } from '../models';

interface UserFilterState {
    role: string;
    isArchive: boolean;
    order: string;
    path: string;
}

interface withHistory {
    history: History;
}
type UserFilterProps =
    ApplicationState
    & UserRouterProps & withHistory
    & typeof UsersStore.actionCreators;

class UserFilter extends React.Component<UserFilterProps, UserFilterState> {
    constructor(props: UserFilterProps) {
        super(props);
        this.state = this.getStateFromProps(props);
    }

    componentWillReceiveProps(nextProps: UserFilterProps) {
        this.setState(this.getStateFromProps(nextProps));
    }

    private getStateFromProps(props: UserFilterProps): UserFilterState {
        return {
            role: typeof props.get['role'] !== 'undefined' ? props.get['role'] : '',
            isArchive: typeof props.get['isArchive'] !== 'undefined' && props.get['isArchive'] == '1',
            order: typeof props.get['order'] !== 'undefined' ? props.get['order'] : 'id:asc',
            path: props.searchParams,
        };
    }

    private Search(event?: React.FormEvent<HTMLFormElement>) {
        console.info('Поиск...');
        if (typeof event !== 'undefined') {
            event.stopPropagation();
            event.preventDefault();
        }
        let params: Hash<string> = {};
        if (this.state.role != '') params['role'] = this.state.role;
        if (this.state.isArchive) params['isArchive'] = '1';
        if (this.state.order != 'id:asc') params['order'] = this.state.order;

        let paramsStr = Utils.join_url_params(params);
        if (paramsStr != '') paramsStr = '?' + paramsStr;
        // поиск и смена сортировки всегда сбрасывают пагинацию в ноль
        let newurl = Utils.UsersUrl(0, paramsStr);

        //console.log('.......', paramsStr, this.props.searchParams);
        if (paramsStr == this.props.searchParams) return; // ничего не изменилось => историю не трогаем
        //console.info('new path=', newurl);

        // смена урла
        let history = this.props.history;
        history.push(newurl);
    }

    public render() {
        // onSubmit можно переписать след образом onSubmit={this.Search.bind(this);} НО в этом случае мы теряем проверку типизации
        return <form className="form-inline user-filter" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { this.Search(event); }}>
            <div className="form-group">
                <label htmlFor="" className="hidden-xs">Должность</label>
                <select autoComplete="off" onChange={(event: React.FormEvent<HTMLSelectElement>) => {
                    console.info('Смена должности: ', event.currentTarget.value);
                    this.setState({ role: event.currentTarget.value }, () => { this.Search(); });
                }} name="role" className="form-control" value={this.state.role}>
                    {
                        UserRoles.map((item) => {
                            return <option key={item.id} value={item.id}>{item.name}</option>;
                        })
                    }
                </select>
            </div>
            <div className="form-group">
                <input onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    console.info('Смена статуса: ', event.currentTarget.checked);
                    this.setState({ isArchive: event.currentTarget.checked }, () => { this.Search(); });
                }} id="input-isArchive" checked={this.state.isArchive} type="checkbox" name="isArchive" value="1" />
                <label className="checkbox-label" htmlFor="input-isArchive">в архиве</label>
            </div>
            <div className="form-group">
                <label htmlFor="" className="hidden-xs">Сортировка</label>
                <select autoComplete="off" onChange={(event: React.FormEvent<HTMLSelectElement>) => {
                    console.info('Смена сортировки: ', event.currentTarget.value);
                    this.setState({ order: event.currentTarget.value }, () => { this.Search(); });
                }} name="role" className="form-control" value={this.state.order}>
                    {
                        UserOrders.map((item) => {
                            return <option key={item.order} value={item.order}>{item.name}</option>;
                        })
                    }
                </select>
            </div>
        </form>;//<input className="btn btn-primary" type="submit" value="Найти" />
    }
}

// Wire up the React component to the Redux store
export default connect<any, any, UserRouterProps & withHistory>(
    (state: ApplicationState) => state, // Selects which state properties are merged into the component's props
    UsersStore.actionCreators                 // Selects which action creators are merged into the component's props
)(UserFilter);
