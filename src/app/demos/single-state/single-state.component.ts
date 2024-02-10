import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { TodoService } from 'src/app/api/to-do';
import { getInitialState } from './state.models';
import { ToDosTableComponent } from '../../shared/to-does-table';
import { SpinnerComponent } from '../../shared/spinner';
import { ErrorComponent } from '../../shared/error';

@Component({
  selector: 'app-single-state',
  standalone: true,
  template: `
    @if (stateSignal(); as state) {
    <!--  -->
    @if( state.loading ){
    <app-spinner />
    } @else if (state.error) {
    <app-error [errorDetails]="state.errorData" (tryAgain)="retry()" />
    } @else if(state.data) {
    <div class="flex gap-2">
      <button (click)="refresh()" [disabled]="state.refreshing">Refresh</button>
      <button (click)="error()" [disabled]="state.refreshing">Make a error!</button>
    </div>

    <div class="relative">
      <app-to-dos-table [toDos]="state.data" [class.opacity-50]="state.refreshing" />
      @if (state.refreshing) {
      <app-spinner class="absolute inset-0" />
      }
    </div>
    } }
  `,
  styleUrls: ['./single-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToDosTableComponent, SpinnerComponent, ErrorComponent],
})
export class SingleStateComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  stateSignal = signal(getInitialState());

  private countErrors = effect(() => {
    const state = this.stateSignal();

    if (state.error === true) {
      // const type = state.errorData.type;
      //            ^ -> 'state.errorData' is possibly 'null'.ts(18047)
    }
  });

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    const state = this.stateSignal();

    this.stateSignal.set({
      error: false,
      errorData: null,
      loading: false,
      refreshing: true,
      data: state.data,
    });

    this.loadData();
  }

  error() {
    // simulate error
    const state = this.stateSignal();

    this.stateSignal.set({
      error: false,
      errorData: null,
      loading: false,
      refreshing: true,
      data: state.data,
    });

    setTimeout(() => {
      this.stateSignal.set({
        error: true,
        errorData: { type: '504' },
        loading: false,
        refreshing: false,
        data: null,
      });
    }, 2_500);
  }

  retry() {
    this.stateSignal.set(getInitialState());
    this.loadData();
  }

  private loadData() {
    this.todoService.getToDos({ limit: 5 }).subscribe((toDos) => {
      this.stateSignal.set({
        loading: false,
        error: false,
        errorData: null,
        refreshing: false,
        data: toDos,
      });
    });
  }
}
