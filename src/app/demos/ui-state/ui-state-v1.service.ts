import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { TodoService } from 'src/app/api/to-do';
import { ComponentState, LoadedState, getInitialState } from './state.models';

@Injectable()
export class UiStateV1Service {
  private readonly todoService = inject(TodoService);
  private state$$ = new BehaviorSubject<ComponentState>(getInitialState());

  state = toSignal(this.state$$, { initialValue: this.state$$.getValue() });

  newSearch(request: LoadedState['request']) {
    const state = this.state$$.getValue();

    if (state.state === 'LOADED') {
      this.state$$.next({
        state: 'REFRESHING',
        data: state.data,
        request,
        totalItems: state.totalItems,
      });
    }

    if (state.state === 'ERROR') {
      this.state$$.next({
        state: 'LOADING',
      });
    }

    this.todoService.getToDosMeta(request).subscribe({
      next: (response) => {
        this.state$$.next({
          state: 'LOADED',
          data: response.items,
          request: request,
          totalItems: response.totalItems,
        });
      },
      error: (error) => {
        this.state$$.next({
          state: 'ERROR',
          error: error,
          fromState: state,
        });
      },
    });
  }
}
