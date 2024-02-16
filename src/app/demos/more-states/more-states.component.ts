import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TodoService, ToDo } from '../../api/to-do';
import { SpinnerComponent } from '../../shared/spinner';
import { ToDosTableComponent } from '../../shared/to-does-table';
import { ErrorComponent } from '../../shared/error';
import { map, timer } from 'rxjs';

@Component({
  selector: 'app-more-states',
  standalone: true,
  templateUrl: `./more-states.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToDosTableComponent, SpinnerComponent, ErrorComponent],
})
export class MoreStatesComponent {
  private toDos$ = inject(TodoService).getToDos({ limit: 3 });

  loading = signal(true);
  refreshing = signal(false);
  error = signal(false);
  toDos = signal<ToDo[]>([]);
  errorData = signal<unknown>(null);

  constructor() {
    this.loadToDos();
  }

  reload() {
    this.loading.set(true);
    this.loadToDos();
  }

  refresh() {
    this.refreshing.set(true);
    this.loadToDos();
  }

  makeError() {
    this.refreshing.set(true);
    timer(2_000)
      .pipe(
        map(() => {
          throw new Error('Server error');
        }),
      )
      .subscribe({
        error: (error) => {
          this.error.set(true);
          this.loading.set(false);
          this.refreshing.set(false);
          this.errorData.set(error);
        },
      });
  }

  private loadToDos() {
    this.toDos$.subscribe({
      next: (toDos) => {
        this.loading.set(false);
        this.refreshing.set(false);
        this.error.set(false);
        this.toDos.set(toDos);
      },
      error: (error) => {
        this.error.set(true);
        this.loading.set(false);
        this.refreshing.set(false);
        this.errorData.set(error);
      },
    });
  }
}
