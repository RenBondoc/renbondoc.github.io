import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: `app-home`,
  standalone: true,
  imports: [],
  templateUrl: `./home.component.html`,
  styleUrl: `./home.component.css`
})
export class HomeComponent {

  @Output() messageEvent = new EventEmitter<string>();

  constructor() {

  }
  
  setHomeText() {
    console.log(`Home Has been clicked. Trying to emit something`);
    this.messageEvent.emit(`You are in the HOME page now`);
  }

  setAboutText() {
    console.log(`About Has been clicked. Trying to emit something`);
    this.messageEvent.emit(`You are in the ABOUT page now`);
  }

  
}
