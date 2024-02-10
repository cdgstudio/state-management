import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TodoService } from "src/app/api/to-do";
import { getInitialState } from "./state.models";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-filterable-table",
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  template: `
    <ng-container *ngIf="stateSignal() as state">
      <h1 *ngIf="state.state === 'loading'">Loading</h1>

      <ng-container *ngIf="state.state === 'loaded'">
        <h1>Loaded</h1>
        <button (click)="refresh()">Refresh</button>
        <button (click)="error()">Make a error!</button>

        <table>
          <tr>
            <th>Id</th>
            <th>Title</th>
          </tr>
          <tr *ngFor="let item of state.data">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
          </tr>
        </table>
      </ng-container>

      <ng-container *ngIf="state.state === 'refreshing'">
        <h1>Refreshing</h1>

        <table>
          <tr>
            <th>Id</th>
            <th>Title</th>
          </tr>
          <tr *ngFor="let item of state.data">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
          </tr>
        </table>
      </ng-container>

      <ng-container *ngIf="state.state === 'error'">
        <h1>Ups! I am a teapot</h1>
        <p>Error: {{ state.error }}</p>
        <button (click)="retry()">Retry</button>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ["./filterable-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  stateSignal = signal(getInitialState());

  form = new FormGroup({
    query: new FormControl("", { nonNullable: true }),
  });

  private disableFormEffect = effect(() => {
    const state = this.stateSignal();

    if (state.state === "refreshing") {
      this.form.controls.query.disable();
    } else {
      this.form.controls.query.enable();
    }
  });

  private updateQueryParams = effect(() => {
    const state = this.stateSignal();

    if (state.state !== "loaded") {
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
    const q = map.get("q") ?? undefined;
    this.form.controls.query.setValue(q ?? "");

    this.loadData({ query: q ?? undefined });
  }

  refresh() {
    const state = this.stateSignal();

    if (state.state !== "loaded") {
      throw new Error("Wrong current state!");
    }

    this.stateSignal.set({
      state: "refreshing",
      data: state.data,
    });

    this.loadData({
      query: state.query,
    });
  }

  updateQuery() {
    const state = this.stateSignal();

    if (state.state !== "loaded") {
      throw new Error("Wrong current state!");
    }

    this.stateSignal.set({
      state: "refreshing",
      data: state.data,
    });

    const query = this.form.controls.query.value;
    this.loadData({ query });
  }

  error() {
    // simulate error
    const state = this.stateSignal();

    if (state.state !== "loaded") {
      throw new Error("Wrong current state!");
    }

    setTimeout(() => {
      this.stateSignal.set({
        state: "error",
        error: "Unkown error!",
      });
    }, 2_500);
  }

  retry() {
    this.stateSignal.set(getInitialState());
    this.loadData();
  }

  private loadData(args: { query?: string } = {}) {
    this.todoService.getToDos(args).subscribe((toDos) => {
      this.stateSignal.set({
        state: "loaded",
        data: toDos,
        query: args.query,
      });
    });
  }
}
