import { ChangeDetectionStrategy, Component, isDevMode } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { routes } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  devMode = isDevMode();
  items = routes
    .filter((route) => route.path)
    .map((route) => ({
      path: route.path!,
      label: route.path!.replace('-', ' '),
    }));
}
