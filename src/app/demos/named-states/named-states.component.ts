import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { TodoService } from 'src/app/api/to-do';
import { getInitialState } from 'src/app/demos/named-states/state.models';

@Component({
  selector: 'app-named-states',
  standalone: true,
  imports: [],
  template: `
    @if (stateSignal(); as state) { @if (state.state === 'loading') {
    <h1>Loading</h1>
    } @if (state.state === 'loaded') {

    <h1>Loaded</h1>
    <button (click)="refresh()">Refresh</button>
    <button (click)="error()">Make a error!</button>
    <table>
      <tr>
        <th>Id</th>
        <th>Title</th>
      </tr>
      @for (item of state.data; track item) {
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.title }}</td>
      </tr>
      }
    </table>

    } @if (state.state === 'refreshing') {

    <h1>Refreshing</h1>
    <table>
      <tr>
        <th>Id</th>
        <th>Title</th>
      </tr>
      @for (item of state.data; track item) {
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.title }}</td>
      </tr>
      }
    </table>

    } @if (state.state === 'error') {

    <h1>Ups! I am a teapot</h1>
    <p>Error: {{ state.error }}</p>
    <button (click)="retry()">Retry</button>

    } }
  `,
  styleUrls: ['./named-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.todoService.getToDos().subscribe((toDos) => {
      this.stateSignal.set({
        state: 'loaded',
        data: toDos,
      });
    });
  }
}
