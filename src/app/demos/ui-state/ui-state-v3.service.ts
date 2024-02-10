import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, ReplaySubject, map } from "rxjs";
import { ToDo, TodoService } from "src/app/api/to-do";

interface RequestState {
  pageSize: number;
  pageNumber: number;
}

interface ResponseState {
  readonly totalItems: number;
  readonly items: ToDo[];
}

@Injectable()
export class UiStateV3Service {
  private readonly todoService = inject(TodoService);
  private requestState$$ = new BehaviorSubject<RequestState>({
    pageSize: 10,
    pageNumber: 0,
  });

  private responseState$$ = new ReplaySubject<ResponseState>(1);

  requestState$ = this.requestState$$.asObservable();
  responseState$ = this.responseState$$.asObservable();

  items$ = this.responseState$.pipe(map((state) => state.items));
  totalItems$ = this.responseState$.pipe(map((state) => state.totalItems));

  loadItems() {
    this.refresh();
  }

  nextPage() {
    const state = this.requestState$$.value;
    this.requestState$$.next({
      pageSize: state.pageSize,
      pageNumber: state.pageNumber + 1,
    });

    this.refresh();
  }

  previewPage() {
    const state = this.requestState$$.value;
    this.requestState$$.next({
      pageSize: state.pageSize,
      pageNumber: state.pageNumber - 1,
    });

    this.refresh();
  }

  private refresh() {
    const state = this.requestState$$.value;

    this.todoService
      .getToDosMeta({
        page: state.pageNumber,
        limit: state.pageSize,
      })
      .subscribe((response) => this.responseState$$.next(response));
  }
}
