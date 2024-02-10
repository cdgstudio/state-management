import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from '../../shared/error/index';
import { SpinnerComponent } from '../../shared/spinner/index';
import { ToDosTableComponent } from '../../shared/to-does-table';
import { LoadedState } from './state.models';
import { UiStateV1Service } from './ui-state-v1.service';

@Component({
  selector: 'app-ui-state',
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

      <div class="flex justify-between mt-4">
        <div></div>
        <div class="flex gap-4">
          <button (click)="previous()" [disabled]="state.request.page === 1">Previous</button>
          <button (click)="next()">Next</button>
        </div>
        <p class="text-gray-500">
          {{ state.request.limit * (state.request.page - 1) + 1 }} -
          {{ state.request.limit + state.request.limit * (state.request.page - 1) }} /
          {{ state.totalItems }}
        </p>
      </div>

      @if (state.state === 'refreshing') {
      <app-spinner class="absolute inset-0" />
      }
    </div>
    }
    <!--  -->
    }
  `,
  styleUrls: ['./ui-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UiStateV1Service],
  imports: [ReactiveFormsModule, ToDosTableComponent, SpinnerComponent, ErrorComponent],
})
export class UiStateComponent {
  private readonly uiStateService = inject(UiStateV1Service);
  stateSignal = this.uiStateService.state;

  form = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
    page: new FormControl(1, { nonNullable: true }),
    limit: new FormControl(10, { nonNullable: true }),
  });

  get formValue(): LoadedState['request'] {
    return this.form.value as LoadedState['request'];
  }

  ngOnInit() {
    this.uiStateService.newSearch(this.formValue);
  }

  next() {
    this.form.patchValue({
      page: this.form.controls.page.value + 1,
    });

    this.uiStateService.newSearch(this.formValue);
  }

  previous() {
    this.form.patchValue({
      page: this.form.controls.page.value - 1,
    });

    this.uiStateService.newSearch(this.formValue);
  }

  updateQuery() {
    this.form.patchValue({
      page: 1,
    });

    this.uiStateService.newSearch(this.formValue);
  }

  retry() {
    this.uiStateService.newSearch(this.formValue);
  }
}
