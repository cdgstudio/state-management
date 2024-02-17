import { Component } from '@angular/core';
import { routes } from '../../app.config';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  template: `
    <div class="container ml-auto mr-auto">
      <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Demos:</h2>
      <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        @for (item of items; track item) {
          <li>
            <a [routerLink]="item.path">
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  imports: [RouterLink, RouterLinkActive],
})
export default class MainComponent {
  items = routes
    .filter((route) => route.path)
    .map((route) => ({
      path: route.path!,
      label: route.path!.replace('-', ' '),
    }));
}
