import { ToDo } from "../../api/to-do";

export interface LoadingState {
  state: "loading";
}

export interface LoadedState {
  state: "loaded";
  data: ToDo[];
  query: string | undefined;
}

export interface RefreshingState {
  state: "refreshing";
  data: ToDo[];
}

export interface ErrorState {
  state: "error";
  error: unknown;
}

export type ComponentState = LoadingState | LoadedState | RefreshingState | ErrorState;

export function getInitialState(): ComponentState {
  return {
    state: "loading",
  };
}