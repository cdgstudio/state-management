import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from 'src/app/api/to-do';
import { getInitialState } from './state.models';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner';
import { ErrorComponent } from '../../shared/error';
import { ToDosTableComponent } from '../../shared/to-does-table';

@Component({
  selector: 'app-filterable-table',
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

    <form [formGroup]="form" class="mb-5 mt-5" (ngSubmit)="updateQuery()">
      <input
        type="text"
        formControlName="query"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder="Query"
        [readOnly]="state.state === 'refreshing'"
      />
    </form>

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
  styleUrls: ['./filterable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SpinnerComponent, ErrorComponent, ToDosTableComponent],
})
export class FilterableTableComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  stateSignal = signal(getInitialState());

  form = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
  });

  private updateQueryParams = effect(() => {
    const state = this.stateSignal();

    if (state.state !== 'loaded') {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { q: state.query },
      replaceUrl: true,
    });
  });

  ngOnInit(): void {
    const map = this.activatedRoute.snapshot.queryParamMap;
    const q = map.get('q') ?? undefined;
    this.form.controls.query.setValue(q ?? '');

    this.loadData({ query: q ?? undefined });
  }

  refresh() {
    const state = this.stateSignal();

    if (state.state !== 'loaded') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      state: 'refreshing',
      data: state.data,
    });

    this.loadData({
      query: state.query,
    });
  }

  updateQuery() {
    const state = this.stateSignal();

    if (state.state !== 'loaded') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      state: 'refreshing',
      data: state.data,
    });

    const query = this.form.controls.query.value;
    this.loadData({ query });
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

  private loadData(args: { query?: string } = {}) {
    this.todoService
      .getToDos({
        query: args.query,
        limit: 5,
      })
      .subscribe((toDos) => {
        this.stateSignal.set({
          state: 'loaded',
          data: toDos,
          query: args.query,
        });
      });
  }
}
