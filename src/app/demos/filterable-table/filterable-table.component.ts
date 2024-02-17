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
      <p class="my-4">The current state is: {{ state.name }}</p>

      <!--  -->
      @if (state.name === 'LOADING') {
        <app-spinner />
      }
      <!--  -->
      @if (state.name === 'ERROR') {
        <app-error [errorDetails]="state.error" (tryAgain)="retry()" />
      }
      <!--  -->
      @if (state.name === 'LOADED' || state.name === 'REFRESHING') {
        <div class="flex gap-2">
          <button (click)="refresh()" [disabled]="state.name === 'REFRESHING'">Refresh</button>
          <button (click)="error()" [disabled]="state.name === 'REFRESHING'">Make a error!</button>
        </div>

        <form [formGroup]="form" class="mb-5 mt-5" (ngSubmit)="updateQuery()">
          <input
            type="text"
            formControlName="query"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Query"
            [readOnly]="state.name === 'REFRESHING'"
          />
        </form>

        <div class="relative">
          <app-to-dos-table [toDos]="state.data" [class.opacity-50]="state.name === 'REFRESHING'" />
          @if (state.name === 'REFRESHING') {
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

    if (state.name !== 'LOADED') {
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

    this.loadData({
      query: this.form.controls.query.value,
    });
  }

  refresh() {
    const state = this.stateSignal();

    if (state.name !== 'LOADED') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      name: 'REFRESHING',
      data: state.data,
    });

    this.loadData({
      query: state.query,
    });
  }

  updateQuery() {
    const state = this.stateSignal();

    if (state.name !== 'LOADED') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      name: 'REFRESHING',
      data: state.data,
    });

    const query = this.form.controls.query.value;
    this.loadData({ query });
  }

  error() {
    // simulate error
    const state = this.stateSignal();

    if (state.name !== 'LOADED') {
      throw new Error('Wrong current state!');
    }

    this.stateSignal.set({
      name: 'REFRESHING',
      data: state.data,
    });

    setTimeout(() => {
      this.stateSignal.set({
        name: 'ERROR',
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
          name: 'LOADED',
          data: toDos,
          query: args.query,
        });
      });
  }
}
