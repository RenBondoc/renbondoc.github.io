import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger, AnimationEvent, keyframes } from '@angular/animations';
import { TypewriterService } from './services/typewriter.service';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: `app-root`,
  standalone: true,
  imports: [ 
    RouterOutlet,
    HomeComponent,
    CommonModule
  ],
  templateUrl: `./app.component.html`,
  styleUrl: `./app.component.css`,
  animations: [
    trigger(`zoomAnimation`, [
      state(`initial`, style({
        transform: `scale(1)`,
      })),
      state(`zoomedIn`, style({
        transform: `scale(1.8) translateY(15%)`,
      })),
      transition(`initial => zoomedIn`, [
        animate(`0.8s`)
      ]),
      transition(`zoomedIn => initial`, [
        animate('0.3s')
      ])
    ])
  ]
})
export class AppComponent {

  
  private backgroundImgSrc: string;
  private textTypeWriter: Observable<string>;
  private text: string;
  private zoomState: string;

  private showText: boolean;
  private zoomedIn: boolean;

  //Inject Service
  private typewriterService = inject(TypewriterService);

  constructor() {
    this.backgroundImgSrc = `../assets/img/background.jpg`
    this.zoomState = `initial`;
    this.textTypeWriter = of(``)
    this.text = ``;
    this.showText = false;
    this.zoomedIn = false;
  }

  getTextTypeWriter(): Observable<string> {
    return this.textTypeWriter;
  }

  getBackgroundImg(): string {
    return this.backgroundImgSrc;
  }

  getShowText(): boolean {
    return this.showText;
  }

  getZoomState(): string {
    return this.zoomState;
  }

  toggleZoomIn(text: string): void {
    this.zoomState = `zoomedIn`;
    this.text = text;

    if(this.zoomedIn) {
      this.textTypeWriter = this.typewriterService.getTypewriterEffect([text]).pipe(map((text: string) => text));
    }

    
  }

  toggleZoomOut(): void {
    this.showText = false;
    this.text = ``;
    this.zoomState = `initial`;
  }

  onAnimationComplete(event: AnimationEvent): void {
    if (event.toState === `zoomedIn`) {
      this.showText = true;
      this.zoomedIn = true;

    } else {
      this.zoomedIn = false

    }

    this.textTypeWriter = this.typewriterService.getTypewriterEffect([this.text]).pipe(map((text: string) => text));
  }
  
}
