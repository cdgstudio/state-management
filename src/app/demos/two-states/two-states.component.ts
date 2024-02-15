import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TodoService, ToDo } from '../../api/to-do';
import { SpinnerComponent } from '../../shared/spinner';
import { ToDosTableComponent } from '../../shared/to-does-table';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./two-states.component.html`,
  imports: [ToDosTableComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoStatesComponent implements OnInit {
  private toDos$ = inject(TodoService).getToDos({ limit: 3 });

  loading = signal(true);
  toDos = signal<ToDo[]>([]);

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.toDos$.subscribe((toDos) => {
      this.toDos.set(toDos);
      this.loading.set(false);
    });
  }
}
