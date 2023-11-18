import { ChangeDetectionStrategy, Component, OnInit, Signal, effect, inject, signal } from '@angular/core';
import { TodoService } from 'src/app/api/to-do';
import { ComponentState, getInitialState } from './state.models';
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
    }
    <!--  -->
    @if (state.error) {
    <app-error [errorDetails]="state.errorData" (tryAgain)="retry()" />
    }
    <!--  -->
    @if(state.data) {
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

  private lastState = this.stateSignal();
  private logRefreshTime = effect(() => {
    const state = this.stateSignal();

    if (state.refreshing === true) {
      console.time('Refreshing');
    } else if (this.lastState.refreshing === true) {
      console.timeEnd('Refreshing');
    }

    this.lastState = state;
  });

  private countErrors = effect(() => {
    const state = this.stateSignal();

    if (state.error === true) {
      // const type = state.errorData.type;
      //            ^? -> 'state.errorData' is possibly 'null'.ts(18047)
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

    setTimeout(() => {
      this.loadData();
    }, 2_500);
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
        errorData: null,
        loading: true,
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
    this.todoService.getToDos({ limit: 5 }).subscribe({
      next: (toDos) => {
        this.stateSignal.set({
          loading: false,
          error: false,
          errorData: null,
          refreshing: false,
          data: toDos,
        });
      },
      error: (error) => {
        this.stateSignal.set({
          loading: false,
          error: true,
          errorData: error,
          refreshing: false,
          data: null,
        });
      },
    });
  }
}
