import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { UiStateV1Service } from './ui-state-v1.service';

@Component({
  selector: 'app-ui-state',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <table>
      <tr>
        <th>Id</th>
        <th>Title</th>
      </tr>
      @for (item of dataSignal(); track item) {
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.title }}</td>
      </tr>
      }
    </table>

    <p>All items: {{ totalItemsSignal() }}</p>

    <button (click)="next()">Next</button>
    <button (click)="preview()">Preview</button>
  `,
  styleUrls: ['./ui-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UiStateV1Service],
})
export class UiStateComponent {
  private readonly uiStateService = inject(UiStateV1Service);
  dataSignal = toSignal(this.uiStateService.items$);
  totalItemsSignal = toSignal(this.uiStateService.totalItems$);

  ngOnInit() {
    this.uiStateService.loadItems();
  }

  next() {
    this.uiStateService.nextPage();
  }

  preview() {
    this.uiStateService.previewPage();
  }
}
