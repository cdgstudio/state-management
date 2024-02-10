import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { ToDo, TodoService } from "src/app/api/to-do";

interface State {
  pageSize: number;
  pageNumber: number;
  totalItems: number;
  items: ToDo[];
}

@Injectable()
export class UiStateV1Service {
  private readonly todoService = inject(TodoService);
  private state$$ = new BehaviorSubject<State>({
    pageSize: 10,
    pageNumber: 0,
    totalItems: 0,
    items: [],
  });

  state$ = this.state$$.asObservable();
  items$ = this.state$.pipe(map((state) => state.items));
  totalItems$ = this.state$.pipe(map((state) => state.totalItems));

  loadItems() {
    this.refresh();
  }

  nextPage() {
    const state = this.state$$.value;
    this.state$$.next({
      ...state,
      pageNumber: state.pageNumber + 1,
    });

    this.refresh();
  }

  previewPage() {
    const state = this.state$$.value;
    this.state$$.next({
      ...state,
      pageNumber: state.pageNumber - 1,
    });

    this.refresh();
  }

  private refresh() {
    const state = this.state$$.value;

    this.todoService
      .getToDosMeta({
        page: state.pageNumber,
        limit: state.pageSize,
      })
      .subscribe((response) => {
        this.state$$.next({
          ...state,
          items: response.items,
          totalItems: response.totalItems,
        });
      });
  }
}
