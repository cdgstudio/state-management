import { ToDo } from '../../api/to-do';

export interface LoadingState {
  state: 'LOADING';
}

export interface LoadedState {
  state: 'LOADED';
  data: ToDo[];
}

export interface RefreshingState {
  state: 'REFRESHING';
  data: ToDo[];
}

export interface ErrorState {
  state: 'ERROR';
  error: unknown;
}

export type ComponentState = LoadingState | LoadedState | RefreshingState | ErrorState;

export function getInitialState(): ComponentState {
  return {
    state: 'LOADING',
  };
}
