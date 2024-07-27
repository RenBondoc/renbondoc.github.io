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
        transform: `translateY(-100px)`,
      })),
      state(`down`, style({
        transform: `translateY(0px)`,
      })),
      transition(`up => down`, [
        animate(`0.5s`)
      ]),
      transition(`down => up`, [
        animate(`0.5s 1s`)
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
    this.toggleDropdown();

    switch(type) {
      case `Resume`:
        this.messageEvent.emit(`Downloading resume.....`);
        break;
      default:
        this.messageEvent.emit(`You are in the ${type} page now`);
        break;
    }
    
  }

  homeButtonClick(): void {
    this.toggleDropdown();

    this.homeButton.emit();
  }

  toggleDropdown(): void {
    this.showDropDown = !this.showDropDown;
    this.animationState = this.showDropDown ? `down` : `up`;
  }

  getDropDown(): boolean {
    return this.showDropDown;
  }
  
  getAnimationSate(): string {
    return this.animationState;
  }

}
