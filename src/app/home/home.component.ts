import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: `app-home`,
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: `./home.component.html`,
  styleUrl: `./home.component.css`,
  animations: [
    trigger(`slideAnimation`, [
      state(`up`, style({
        transform: `translateY(-300px)`,
      })),
      state(`down`, style({
        transform: `translateY(0px)`,
      })),
      transition(`up => down`, [
        animate(`0.5s`)
      ]),
      transition(`down => up`, [
        animate(`0.5s`)
      ])
    ])
  ]
})
export class HomeComponent {

  @Output() messageEvent = new EventEmitter<string>();
  @Output() homeButton = new EventEmitter<null>();
  @Input() isMobile: boolean;

  private showDropDown: boolean ;
  private animationState: string;

  constructor() {
    this.isMobile = false;
    this.showDropDown = false;
    this.animationState = `up`;
  }

  setText(type: string): void {

    switch(type) {
      case `Resume`:
        this.messageEvent.emit(`Downloading resume.....`);
        break;
      default:
        this.messageEvent.emit(`You are in the ${type} page now`);
        break;
    }
    this.toggleDropdown();
  }

  homeButtonClick(): void {
    this.homeButton.emit();

    if(this.showDropDown) {
      this.showDropDown = false;
    }
  }

  async toggleDropdown(): Promise<void> {
    //The order of this code matters
    console.log(`Checking dropdown: ${this.showDropDown}`)
    if (this.showDropDown) {
      this.animationState = `up`;
      await new Promise( resolve => setTimeout(resolve, 550) );
      this.showDropDown = false;
    } else {
      this.showDropDown = true;
      this.animationState = `down`;
    }
  }

  getDropDown(): boolean {
    return this.showDropDown;
  }
  
  getAnimationSate(): string {
    return this.animationState;
  }

}
