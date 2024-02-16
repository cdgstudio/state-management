import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TodoService } from 'src/app/api/to-do';
import { ErrorComponent } from '../../shared/error';
import { SpinnerComponent } from '../../shared/spinner';
import { ToDosTableComponent } from '../../shared/to-does-table';
import { getInitialState } from './state.models';

@Component({
  selector: 'app-named-states',
  standalone: true,
  templateUrl: './named-states.component.html',
  styleUrls: ['./named-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent, ErrorComponent, ToDosTableComponent],
})
export class NamedStatesComponent {
  private readonly toDos$ = inject(TodoService).getToDos({ limit: 3 });
  state = signal(getInitialState());

  constructor() {
    this.loadData();
  }

  refresh() {
    const state = this.state();

    if (state.state !== 'LOADED') {
      throw new Error('Wrong current state!');
    }

    this.state.set({
      state: 'REFRESHING',
      data: state.data,
    });

    this.loadData();
  }

  makeError() {
    // simulate error
    const state = this.state();

    if (state.state !== 'LOADED') {
      throw new Error('Wrong current state!');
    }

    this.state.set({
      state: 'REFRESHING',
      data: state.data,
    });

    setTimeout(() => {
      this.state.set({
        state: 'ERROR',
        error: 'Unkown error!',
      });
    }, 2_500);
  }

  reload() {
    this.state.set(getInitialState());
    this.loadData();
  }

  private loadData() {
    this.toDos$.subscribe({
      next: (toDos) => {
        this.state.set({
          state: 'LOADED',
          data: toDos,
        });
      },
      error: (error) => {
        this.state.set({
          state: 'ERROR',
          error: error,
        });
      },
    });
  }
}
