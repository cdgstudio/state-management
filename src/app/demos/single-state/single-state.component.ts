import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from "@angular/core";
import { TodoService } from "src/app/api/to-do";
import { getInitialState } from "./state.models";

@Component({
  selector: "app-single-state",
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <ng-container *ngIf="stateSignal() as state">
      <ng-container *ngIf="state.error === false">
        <h1 *ngIf="state.loading">Loading</h1>
        <h1 *ngIf="state.refreshing">Refreshing</h1>
        <h1 *ngIf="!state.loading && !state.refreshing">Loaded</h1>

        <button *ngIf="!state.loading && !state.refreshing" (click)="refresh()">Refresh</button>
        <button *ngIf="!state.loading && !state.refreshing" (click)="error()">Make a error!</button>
      </ng-container>

      <table *ngIf="state.data as data">
        <tr>
          <th>Id</th>
          <th>Title</th>
        </tr>
        <tr *ngFor="let item of data">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
        </tr>
      </table>

      <ng-container *ngIf="state.error">
        <h1>Ups! I am a teapot</h1>
        <p>Error: {{ state.errorData }}</p>
        <button (click)="retry()">Retry</button>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ["./single-state.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleStateComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  stateSignal = signal(getInitialState());

  constructor() {
    effect(() => {
      const state = this.stateSignal();

      if (state.error === false) {
        return;
      }

      // const type = state.errorData.type;
      //            ^ -> 'state.errorData' is possibly 'null'.ts(18047)
    });
  }

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
        errorData: { type: "504" },
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
    this.todoService.getToDos().subscribe((toDos) => {
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
