import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

//import { History } from 'history';

import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';

import { User, EditUserRouterProps, Utils, UserRoles, WithHistory } from '../models';

interface UserEditState {
    user: User;
    error: string;
    formError: string;
}

type UserEditProps =
    ApplicationState
    & EditUserRouterProps & WithHistory
    & typeof UsersStore.actionCreators;

class UserForm extends React.Component<UserEditProps, UserEditState> {
    constructor(props: UserEditProps) {
        super(props);
        let user: User = { id: 0, name: '', birthday: '', role: '', phone: '', isArchive: false };
        let error: string = '';
        if (this.props.userid > 0) {
            let _user = this.props.users.items.find((item) => {
                return (item.id == this.props.userid);
            });
            if (typeof _user === 'undefined')
                error = "юзер не найден";
            else
                user = _user;
        }
        this.state = { user: user, error: error, formError:'' };
    }

    private clearError() {
        this.setState({
            formError:''
        });
    }
    
    private Save(event: React.FormEvent<HTMLFormElement>) {
        console.info('Сохраняем...');
        event.stopPropagation();
        event.preventDefault();

        // валидация
        if (this.state.user.role == '') {
            this.setState({ formError: 'Поле "Должность" обязательно для заполнения'});
            return;
        }
        if (this.state.user.name == '') {
            this.setState({ formError: 'Поле "Имя" обязательно для заполнения' });
            return;
        }
        if (this.state.user.phone == '') {
            this.setState({ formError: 'Поле "Телефон" обязательно для заполнения' });
            return;
        }
        if (this.state.user.birthday == '') {
            this.setState({ formError: 'Поле "Дата рождения" обязательно для заполнения' });
            return;
        }
        if (!Utils.isValidDate(this.state.user.birthday)) {
            this.setState({ formError: 'Поле "Дата рождения" заполнено не корректно' });
            return;
        }
        this.props.update(this.state.user);

        let back = '/';
        if (typeof this.props.back !== 'undefined') back = this.props.back;

        // смена урла
        let history = this.props.history;
        history.push(back);
    }

    public render() {
        if (this.state.error) return <div className="alert alert-danger">{this.state.error}</div>;

        let error = null;
        if (this.state.formError) error = <div className="alert alert-danger">{this.state.formError}</div>;

        //console.log(this.props.userid, this.state.user);

        return <form className="" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { this.Save(event); }}>

            {error}
            <div className="form-group">
                <label htmlFor="" className="">Имя</label>
                <input autoComplete="off" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    let user: User = { ...this.state.user };
                    user.name = event.currentTarget.value;
                    this.setState({ user: user }, () => { this.clearError(); });
                }} name="role" className="form-control" value={this.state.user.name} />
            </div>

            <div className="form-group">
                <input onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    let user: User = { ...this.state.user };
                    user.isArchive = event.currentTarget.checked;
                    this.setState({ user: user }, () => {this.clearError(); });
                }} id="input-isArchive" checked={this.state.user.isArchive} type="checkbox" name="isArchive" value="1" />
                <label className="checkbox-label" htmlFor="input-isArchive">в архиве</label>
            </div>

            <div className="form-group">
                <label htmlFor="" className="">Должность</label>
                <select autoComplete="off" onChange={(event: React.FormEvent<HTMLSelectElement>) => {
                    let user: User = { ...this.state.user };
                    user.role = event.currentTarget.value;
                    this.setState({ user: user }, () => { this.clearError();});
                }} name="role" className="form-control" value={this.state.user.role}>
                    {
                        UserRoles.map((item) => {
                            return <option key={item.id} value={item.id}>{item.name}</option>;
                        })
                    }
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="" className="">Телефон</label>
                <input autoComplete="off" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    let user: User = { ...this.state.user };
                    user.phone = event.currentTarget.value;
                    this.setState({ user: user }, () => { this.clearError(); });
                }} name="role" className="form-control" value={this.state.user.phone} />
            </div>

            <div className="form-group">
                <label htmlFor="" className="">дата рождения</label>
                <input autoComplete="off" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    let user: User = { ...this.state.user };
                    user.birthday = event.currentTarget.value;
                    this.setState({ user: user }, () => { this.clearError(); });
                }} name="role" className="form-control" value={this.state.user.birthday} />
            </div>

            <input type="submit" value="Сохранить" className="btn btn-primary" />
        </form>;
    }
}

// Wire up the React component to the Redux store
export default connect<any, any, EditUserRouterProps & WithHistory>(
    (state: ApplicationState) => state, // Selects which state properties are merged into the component's props
    UsersStore.actionCreators                 // Selects which action creators are merged into the component's props
)(UserForm);
