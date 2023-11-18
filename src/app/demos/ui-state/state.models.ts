import { ToDo } from '../../api/to-do';

export interface LoadingState {
  state: 'loading';
}

export interface LoadedState {
  state: 'loaded';
  data: ToDo[];
  request: {
    query?: string;
    page: number;
    limit: number;
  };
  totalItems: number;
}

export interface RefreshingState {
  state: 'refreshing';
  data: ToDo[];
  request: {
    query?: string;
    page: number;
    limit: number;
  };
  totalItems: number;
}

export interface ErrorState {
  state: 'error';
  error: unknown;
  fromState: ComponentState;
}

export type ComponentState = LoadingState | LoadedState | RefreshingState | ErrorState;

export function getInitialState(): ComponentState {
  return {
    state: 'loading',
  };
}
