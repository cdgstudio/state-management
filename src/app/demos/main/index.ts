import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  template: `
    <svg
      class="block mx-auto mt-40"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      width="500px"
      height="500px"
      viewBox="0 0 960 960"
      style="enable-background:new 0 0 960 960;"
      xml:space="preserve"
    >
      <g>
        <polygon points="562.6,109.8 804.1,629.5 829.2,233.1  " />
        <polygon points="624.9,655.9 334.3,655.9 297.2,745.8 479.6,849.8 662,745.8  " />
        <polygon points="384.1,539.3 575.2,539.3 479.6,307  " />
        <polygon points="396.6,109.8 130,233.1 155.1,629.5  " />
      </g>
    </svg>
  `,
  styles: `
  :host {
    display: block;
  }
  `,
})
export default class MainComponent {}
