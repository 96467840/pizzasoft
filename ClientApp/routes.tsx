import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import { UsersPage, EditUserPage, Error404Page } from './pages';

export const routes = <Layout>
    <Switch>
        <Route exact path='/' component={UsersPage} />
        <Route path="/:start(\\d+)" component={UsersPage} />
        <Route path="/edit/:userid(\\d+)" component={EditUserPage} />
        <Route path="/add" component={EditUserPage} />
        <Route component={Error404Page} />
    </Switch>
</Layout>;
