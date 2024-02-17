import { ToDo } from '../../api/to-do';

export interface LoadingState {
  name: 'LOADING';
}

export interface LoadedState {
  name: 'LOADED';
  data: ToDo[];
  query: string | undefined;
}

export interface RefreshingState {
  name: 'REFRESHING';
  data: ToDo[];
}

export interface ErrorState {
  name: 'ERROR';
  error: unknown;
}

export type ComponentState = LoadingState | LoadedState | RefreshingState | ErrorState;

export function getInitialState(): ComponentState {
  return {
    name: 'LOADING',
  };
}
