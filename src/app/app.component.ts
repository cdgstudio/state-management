import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  items = [
    {
      link: 'loading-state',
      text: 'Loading state',
    },
    {
      link: 'more-states',
      text: 'More states',
    },
    // ---
    {
      link: 'single-state',
      text: 'Single state',
    },
    {
      link: 'named-states',
      text: 'Named states',
    },
    {
      link: 'filterable-table',
      text: 'With filter',
    },
    {
      link: 'ui-state',
      text: 'UI State',
    },
  ];
}
