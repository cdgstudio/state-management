import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { TodoService } from 'src/app/api/to-do';
import { getInitialState } from 'src/app/demos/named-states/state.models';
import { SpinnerComponent } from '../../shared/spinner';
import { ErrorComponent } from '../../shared/error';
import { ToDosTableComponent } from '../../shared/to-does-table';

@Component({
  selector: 'app-named-states',
  standalone: true,
  template: `
    @if (stateSignal(); as state) {
    <p class="my-4">The current state is: {{ state.state }}</p>

    <!--  -->
    @if(state.state === 'loading') {
    <app-spinner />
    }
    <!--  -->
    @if(state.state === 'error') {
    <app-error [errorDetails]="state.error" (tryAgain)="retry()" />
    }
    <!--  -->
    @if(state.state === 'loaded' || state.state === 'refreshing') {
    <div class="flex gap-2">
      <button (click)="refresh()" [disabled]="state.state === 'refreshing'">Refresh</button>
      <button (click)="error()" [disabled]="state.state === 'refreshing'">Make a error!</button>
    </div>

    <div class="relative">
      <app-to-dos-table [toDos]="state.data" [class.opacity-50]="state.state === 'refreshing'" />
      @if (state.state === 'refreshing') {
      <app-spinner class="absolute inset-0" />
      }
    </div>
    }
    <!--  -->
    }
  `,
  styleUrls: ['./named-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent, ErrorComponent, ToDosTableComponent],
})
export class NamedStatesComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  stateSignal = signal(getInitialState());

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    const state = this.stateSignal();
    // const state = this.stateSignal() as LoadedState;

    if (state.state !== 'loaded') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      state: 'refreshing',
      data: state.data,
    });

    this.loadData();
  }

  error() {
    // simulate error
    const state = this.stateSignal();

    if (state.state !== 'loaded') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      state: 'refreshing',
      data: state.data,
    });

    setTimeout(() => {
      this.stateSignal.set({
        state: 'error',
        error: 'Unkown error!',
      });
    }, 2_500);
  }

  retry() {
    this.stateSignal.set(getInitialState());
    this.loadData();
  }

  private loadData() {
    this.todoService
      .getToDos({
        limit: 5,
      })
      .subscribe((toDos) => {
        this.stateSignal.set({
          state: 'loaded',
          data: toDos,
        });
      });
  }
}
