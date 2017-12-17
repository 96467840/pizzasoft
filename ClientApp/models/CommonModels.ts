import { History } from 'history';

export interface Hash<T> { [s: string]: T; }
export interface WithHistory {
    history: History;
}