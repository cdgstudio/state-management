import { Component, Input } from '@angular/core';
import { ToDo } from '../../api/to-do';

@Component({
  selector: 'app-to-dos-table',
  template: `
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="col" class="px-6 py-4">#</th>
          <th scope="col" class="px-6 py-4">Title</th>
          <th scope="col" class="px-6 py-4">Completed</th>
        </tr>
      </thead>
      <tbody>
        @for (item of toDos; track item.id) {
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="whitespace-nowrap px-6 py-4 font-medium">{{ item.id }}</td>
            <td class="whitespace-nowrap px-6 py-4">{{ item.title }}</td>
            <td class="whitespace-nowrap px-6 py-4">{{ item.completed }}</td>
          </tr>
        } @empty {
          <tr class="border-b transition duration-300 ease-in-out hover:bg-neutral-100">
            <td class="whitespace-nowrap px-6 font-medium py-10 text-center" colspan="3">NO ITEMS</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    :host {
      @apply block;
    }
  `,
  standalone: true,
})
export class ToDosTableComponent {
  @Input({ required: true }) toDos!: ToDo[] | null | undefined;
}
