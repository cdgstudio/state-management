import { ToDo } from 'src/app/api/to-do';

export interface ComponentState {
  loading: boolean;
  refreshing: boolean;
  error: boolean;
  toDos: ToDo[];
  errorData: Error | null;
}

export function getInitialState(): ComponentState {
  return {
    loading: true,
    refreshing: false,
    toDos: [],
    error: false,
    errorData: null,
  };
}
