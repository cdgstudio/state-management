import { ToDo } from '../../api/to-do';

export interface LoadingState {
  state: 'LOADING';
}

export interface LoadedState {
  state: 'LOADED';
  data: ToDo[];
  request: {
    query?: string;
    page: number;
    limit: number;
  };
  totalItems: number;
}

export interface RefreshingState {
  state: 'REFRESHING';
  data: ToDo[];
  request: {
    query?: string;
    page: number;
    limit: number;
  };
  totalItems: number;
}

export interface ErrorState {
  state: 'ERROR';
  error: unknown;
  fromState: ComponentState;
}

export type ComponentState = LoadingState | LoadedState | RefreshingState | ErrorState;

export function getInitialState(): ComponentState {
  return {
    state: 'LOADING',
  };
}
