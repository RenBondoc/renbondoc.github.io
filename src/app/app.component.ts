import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { TypewriterService } from './services/typewriter.service';
import { map, Observable, of } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';

@Component({
  selector: `app-root`,
  standalone: true,
  imports: [ 
    RouterOutlet,
    HomeComponent,
    CommonModule,
    FormsModule
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
export class AppComponent implements OnInit{
  
  @ViewChild(HomeComponent) homeComponent!: HomeComponent
  
  private backgroundImgSrc: string;
  private textTypeWriter: Observable<string>;
  private zoomState: string;

  private showText: boolean;
  private zoomedIn: boolean;
  private isMobile: boolean;

  private previousText: Array<string>;

  //Inject Service
  private typewriterService: TypewriterService = inject(TypewriterService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private document: Document = inject(DOCUMENT);
  inputText: string;

  constructor() {
    this.backgroundImgSrc = `../assets/img/background.jpg`;
    this.zoomState = `initial`;
    this.textTypeWriter = of(``)
    this.showText = false;
    this.zoomedIn = false;
    this.isMobile = false;
    this.previousText = [];
    this.inputText = ``;
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true;
        console.log(`Using Mobile View`);
        this.backgroundImgSrc = `../assets/img/mobile_background_closeup.jpg`;
      } else {
        this.isMobile = false;
        console.log(`Using Desktop View`);
        this.backgroundImgSrc = `../assets/img/background.jpg`;
      }
    });
  }

  ngAfterViewChecked(): void {
    // if (this.showText) {
    //   this.scrollToBottom();
    // } 
  }

  getTextTypeWriter(): Observable<string> {
    return this.textTypeWriter;
  }

  getPreviousTexts(): Array<string> {
    return this.previousText;
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

  getIsMobile(): boolean {
    return this.isMobile;
  }

  toggleZoomIn(text: string): void {
    this.zoomState = `zoomedIn`;
    if(this.zoomedIn) {
      this.textTypeWriter = this.typewriterService.getTypewriterEffect([text]).pipe(map((text: string) => {
        this.scrollToBottom();
        return text 
      }));
    }
    this.previousText.push(text);
  }

  toggleZoomOut(): void {
    this.showText = false;
    this.previousText = [];
    this.zoomState = `initial`;
  }

  onAnimationComplete(event: AnimationEvent): void {
    if (event.toState === `zoomedIn`) {
      this.showText = true;
      this.zoomedIn = true;
    } else {
      this.zoomedIn = false
    }

    this.textTypeWriter = this.typewriterService.getTypewriterEffect([this.previousText[this.previousText.length - 1]]).pipe(map((text: string) => text));
  }
  
  scrollToBottom() {
    setTimeout(() => {
      let scrollableDiv: HTMLElement | null = this.document.getElementById(`text-container`);
      if (scrollableDiv) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    }, 0);
  }

  onSubmit(input: string) {
    console.log(`Input: ${input}`);
    this.inputText = input;
    this.homeComponent.setText(this.inputText);
    this.inputText = ``;
  }
  
}