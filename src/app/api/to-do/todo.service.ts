import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { delay, map, tap } from "rxjs";
import { ToDo } from "./todo.models";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private readonly http = inject(HttpClient);

  getToDos(args: { query?: string; page?: number; limit?: number } = {}) {
    let params = new HttpParams();

    if (args.query) {
      params = params.set("q", args.query);
    }

    if (typeof args.page === "number") {
      params = params.set("_page", args.page);
    }

    if (typeof args.limit === "number") {
      params = params.set("_limit", args.limit);
    }

    return this.http.get<ToDo[]>(`https://jsonplaceholder.typicode.com/todos/`, { params }).pipe(delay(1_500));
  }

  getToDosMeta(args: { query?: string; page?: number; limit?: number } = {}) {
    let params = new HttpParams();

    if (args.query) {
      params = params.set("q", args.query);
    }

    if (typeof args.page === "number") {
      params = params.set("_page", args.page);
    }

    if (typeof args.limit === "number") {
      params = params.set("_limit", args.limit);
    }

    return this.http.get<ToDo[]>(`https://jsonplaceholder.typicode.com/todos/`, { params, observe: "response" }).pipe(
      map((response) => ({
        items: response.body!,
        totalItems: +response.headers.get("X-Total-Count")!,
      }))
    );
  }
}
