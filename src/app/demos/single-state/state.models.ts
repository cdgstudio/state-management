import { ToDo } from 'src/app/api/to-do';

export interface ComponentState {
  loading: boolean;
  refreshing: boolean;
  error: boolean;
  data: ToDo[] | null;
  errorData: { type: string } | null;
}

export function getInitialState(): ComponentState {
  return {
    loading: true,
    refreshing: false,
    data: null,
    error: false,
    errorData: null,
  };
}

// ---
// export interface NoErrorState {
//   loading: boolean;
//   refreshing: boolean;
//   data: ToDo[] | null;
//   error: false;
//   errorData: null;
// }

// export interface ErrorState {
//   loading: boolean;
//   refreshing: boolean;
//   data: ToDo[] | null;
//   error: true;
//   errorData: { type: string };
// }

// export type ComponentState = NoErrorState | ErrorState;
