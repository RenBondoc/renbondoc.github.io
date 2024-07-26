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
  @Output() homeButton = new EventEmitter<null>();

  constructor() {

  }

  setText(type: string): void {
    this.messageEvent.emit(`You are in the ${type} page now`);
  }

  homeButtonClick(): void {
    this.homeButton.emit();
  }
  
}
