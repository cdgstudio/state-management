import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { map, timer } from 'rxjs';
import { TodoService } from 'src/app/api/to-do';
import { ErrorComponent } from '../../shared/error';
import { SpinnerComponent } from '../../shared/spinner';
import { ToDosTableComponent } from '../../shared/to-does-table';
import { getInitialState } from './state.models';

@Component({
  selector: 'app-state-object',
  standalone: true,
  templateUrl: './state-object.component.html',
  styleUrls: ['./state-object.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToDosTableComponent, SpinnerComponent, ErrorComponent],
})
export class StateObjectComponent {
  private toDos$ = inject(TodoService).getToDos({ limit: 3 });
  state = signal(getInitialState());

  constructor() {
    this.loadToDos();
  }

  reload() {
    this.state.update((old) => ({ ...old, loading: true }));
    this.loadToDos();
  }

  refresh() {
    this.state.update((old) => ({ ...old, refreshing: true }));
    this.loadToDos();
  }

  makeError() {
    this.state.update((old) => ({ ...old, refreshing: true }));

    timer(2_000)
      .pipe(
        map(() => {
          throw new Error('Server error');
        }),
      )
      .subscribe({
        error: (error) => {
          this.state.update((old) => ({
            ...old,
            refreshing: true,
            error: true,
            loading: false,
            errorData: error,
          }));
        },
      });
  }

  private loadToDos() {
    this.toDos$.subscribe({
      next: (toDos) => {
        this.state.update((old) => ({
          ...old,
          loading: false,
          refreshing: false,
          error: false,
          errorData: null,
          toDos: toDos,
        }));
      },
      error: (error) => {
        this.state.update((old) => ({
          ...old,
          error: true,
          loading: false,
          refreshing: false,
          errorData: error,
        }));
      },
    });
  }
}
