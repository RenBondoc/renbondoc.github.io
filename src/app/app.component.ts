import { Component, inject, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { TypewriterService } from './services/typewriter.service';
import { map, Observable, of } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

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
  private textTypeWriter: Observable<SafeValue>;
  private zoomState: string;

  private showText: boolean;
  private zoomedIn: boolean;
  private isMobile: boolean;
  private showCoverText: boolean;

  private previousText: Array<SafeValue>;

  //Inject Service
  private typewriterService: TypewriterService = inject(TypewriterService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private document: Document = inject(DOCUMENT);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  
  
  
  inputText: string;

  constructor() {
    this.backgroundImgSrc = `../assets/img/background.jpg`;
    this.zoomState = `initial`;
    this.textTypeWriter = of(``)
    this.showText = false;
    this.zoomedIn = false;
    this.previousText = [];
    this.inputText = ``;
    this.showCoverText = true;
    this.isMobile = this.checkMobileView();
  }

  ngOnInit(): void {
    this.isMobile = this.checkMobileView();
  }

  private checkMobileView(): boolean {
    let isMobileView: boolean = false;

    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        isMobileView = true;
        console.log(`Using Mobile View`);
        this.backgroundImgSrc = `../assets/img/mobile_background_closeup.jpg`;
      } else {
        isMobileView = false;
        console.log(`Using Desktop View`);
        this.backgroundImgSrc = `../assets/img/background.jpg`;
      }
    });

    return isMobileView;
  }

  getTextTypeWriter(): Observable<SafeValue> {
    return this.textTypeWriter;
  }

  getPreviousTexts(): Array<SafeValue> {
    return this.previousText.slice(0, -1);
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
    this.showCoverText = false;
    //Have to change the sanitizers together to be able to allow the HTML sanitize. bypassSecurity allows the LinkedIn link to be sanitized. The SecurityContext.URL returns string for HTML sanitize
    const safeValue: SafeValue = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(text)) ?? ``;

    console.log(`SafeValue: ${safeValue}`);
    if(this.zoomedIn) {
      this.textTypeWriter = this.typewriterService.getTypewriterEffect([safeValue]).pipe(map((text: SafeValue) => {
        this.scrollToBottom();
        return text 
      }));
    }
    this.previousText.push(safeValue);
  }

  async toggleZoomOut(): Promise<void> {
    this.showText = false;
    this.previousText = [];
    this.zoomState = `initial`;
    await new Promise( resolve => setTimeout(resolve, 300) );
    this.showCoverText = true;
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
  
  scrollToBottom(): void {
    setTimeout(() => {
      let scrollableDiv: HTMLElement | null = this.document.getElementById(`autoScroll`);
      if (scrollableDiv) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    }, 0);
  }

  onSubmit(input: string): void {
    this.inputText = input;
    this.previousText.push(this.sanitizer.sanitize(SecurityContext.HTML, `<span class="dynamicText">${input}</span>`) ?? ``);
    this.homeComponent.setText(this.inputText);
    this.inputText = ``;
  }

  isCoverTextHidden(): boolean {
    return this.showCoverText;
  }

  getWelcomeText(): string {
    return `Welcome!\nPlease enter the command <span class="dynamicText">'help'</span> if you would like to see what you are able to do.`;
  }
  
}