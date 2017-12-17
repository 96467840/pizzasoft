import { Action, Reducer } from 'redux';
import { User, defaultUsers, Utils } from '../models';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UsersState {
    //count: number;
    items: Array<User>;
    itemsOnPage: number;
    // результаты операция над юезерами
    error: string | null;
    message: string | null;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface UpdateUserAction { type: 'UPDATE_USER', user: User }
interface DeleteUserAction { type: 'DELETE_USER', id: number }
interface SetErrorAction { type: 'SET_ERROR', error: string | null }
interface SetMessageAction { type: 'SET_MESSAGE', message: string | null }
interface EmptyAction { type: 'EMPTY_ACTION' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateUserAction | DeleteUserAction | SetErrorAction | SetMessageAction | EmptyAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    update: (user: User): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'UPDATE_USER', user: user });
    },
    delete: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'DELETE_USER', id: id });
    },
    setError: (error: string | null): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SET_ERROR', error: error });
    },
    setMessage: (message: string | null): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SET_MESSAGE', message: message });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: UsersState = { items: defaultUsers/*.splice(0, 10)*/, error: null, message: null, itemsOnPage: 5 };

export const reducer: Reducer<UsersState> = (state: UsersState, action: KnownAction) => {
    let newstate = { ...state };
    switch (action.type) {
        case 'UPDATE_USER':
            if (action.user.id == 0) {
                console.info('[Users] add new user:', action.user);
                let user = action.user;
                user.id = Utils.GetNextId(newstate.items);
                newstate.items.push(user);
                newstate.message = 'Юзер добавлен';
            } else {
                console.info('[Users] update user:', action.user);
                let index = newstate.items.findIndex((user) => {
                    return user.id == action.user.id;
                });
                if (index >= 0) {
                    let oldUser = newstate.items.splice(index, 1, action.user);
                    newstate.message = 'Юзер обновлен';
                } else {
                    // если пытаемся добавить нового юзера с указанием ид, то будем считать это ошибкой. в теории ид у нас автоинкремент поле
                    // хотя можем и сделать вставку как нового юзера в задании ничего конкретного на сей счет не указано
                    console.error('Попытка добавить юзера с указанным идентификатором => игнорим юзера');

                    // а так как мы проигнорили юзера то и стэйт менять не будем. опять же здесь мы можем установить ошибку, но просто проигнорим
                    return state;
                }
            }
            return newstate;
        case 'DELETE_USER':
            console.info('[Users] delete user with id:', action.id);
            let index = newstate.items.findIndex((user) => {
                return user.id == action.id;
            });
            if (index >= 0) {
                let oldUser = newstate.items.splice(index, 1);
                newstate.message = 'Юзер удален';
            } else {
                // юзер уже удален или его небыло
            }
            return newstate;
        case 'SET_ERROR':
            newstate.error = action.error;
            return newstate;
        case 'SET_MESSAGE':
            newstate.message = action.message;
            return newstate;
        case 'EMPTY_ACTION':
            break;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || unloadedState;
};
