import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div class="-mx-4 flex">
      <div class="w-full px-4">
        <div class="mx-auto max-w-[400px] text-center fill-inherit">
          <svg
            width="200px"
            height="200px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="block mx-auto"
          >
            <g stroke-width="0"></g>
            <g stroke-linecap="round" stroke-linejoin="round"></g>
            <g>
              <path
                d="M9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11Z"
                fill="#ffffff"
              ></path>
              <path
                d="M14 17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17H8C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H14Z"
                fill="#ffffff"
              ></path>
              <path
                d="M16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10Z"
                fill="#ffffff"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
                fill="#ffffff"
              ></path>
            </g>
          </svg>

          <h4 class="mb-3 text-[22px] font-semibold leading-tight text-white">Oops! Something bad happend</h4>
          <p class="mb-8 text-lg text-white">But do not worry. You can always try again!</p>
          <button (click)="tryAgain.next()" class="px-8 py-3">Try again</button>
        </div>
      </div>
    </div>
    <div
      class="absolute top-0 left-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14"
    >
      <div class="h-full w-1/3 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"></div>
      <div class="flex h-full w-1/3">
        <div class="h-full w-1/2 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"></div>
        <div class="h-full w-1/2 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"></div>
      </div>
      <div class="h-full w-1/3 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"></div>
    </div>
  `,
  standalone: true,
  styles: `
    :host {
      @apply block bg-gray-900 relative z-10 py-[120px];
    }
  `,
})
export class ErrorComponent {
  @Input({ required: true }) errorDetails!: unknown;
  @Output() tryAgain = new EventEmitter<void>();
}
