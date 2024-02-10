import { Component, Input } from '@angular/core';
import { ToDo } from '../../api/to-do';

@Component({
  selector: 'app-to-dos-table',
  template: `
    <table class="min-w-full text-left text-sm font-light">
      <thead class="border-b font-medium dark:border-neutral-500">
        <tr>
          <th scope="col" class="px-6 py-4">#</th>
          <th scope="col" class="px-6 py-4">Title</th>
          <th scope="col" class="px-6 py-4">Completed</th>
        </tr>
      </thead>
      <tbody>
        @for (item of toDos; track item.id) {
        <tr
          class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
        >
          <td class="whitespace-nowrap px-6 py-4 font-medium">{{ item.id }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ item.title }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ item.completed }}</td>
        </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
  :host {
    @apply block;
  }`,
  standalone: true,
})
export class ToDosTableComponent {
  @Input({ required: true }) toDos!: ToDo[];
}