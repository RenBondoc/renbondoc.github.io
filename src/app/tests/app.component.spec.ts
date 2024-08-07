import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationEvent } from '@angular/animations';
import { TypewriterService } from '../services/typewriter.service';
import { of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HomeComponent } from '../home/home.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

describe(`AppComponent`, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let typewriterService: TypewriterService;
  let breakpointObserverMock: jasmine.Spy;
  let mockBreakpointState: BreakpointState;
  let homeComponent: HomeComponent;
  let sanitizer: DomSanitizer;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async () => {;

    mockBreakpointState = {
      matches: false,
      breakpoints: {
        '(max-width: 899px)': false
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BrowserAnimationsModule,
        HomeComponent
      ],
      providers: [
        TypewriterService,
        BreakpointObserver
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    typewriterService = TestBed.inject(TypewriterService);
    homeComponent = TestBed.createComponent(HomeComponent).componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    breakpointObserver = TestBed.inject(BreakpointObserver);

    // 

    breakpointObserverMock = spyOn(breakpointObserver, `observe`).and.returnValue(of(mockBreakpointState));
  });

  it(`should create the app`, () => {
    expect(component).toBeTruthy();
  });

  it(`should set isMobile to true when handset breakpoint matches`, () => {
    const mockBreakpointState: BreakpointState = {
      matches: true,
      breakpoints: {
        '(max-width: 599px)': true
      }
    };
    breakpointObserverMock.and.returnValue(of(mockBreakpointState));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.getIsMobile()).toBeTrue();
    expect(component.getBackgroundImg()).toBe(`../assets/img/mobile_background_closeup.jpg`);
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`div p`)?.textContent).toEqual(`Welcome to Renan's PortfolioClick Here to Start`);
    expect(component.isCoverTextHidden()).toBeTrue();
  });

  it(`should set isMobile to false when handset breakpoint does not match`, () => {

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.getIsMobile()).toBeFalse();
    expect(component.getBackgroundImg()).toBe(`../assets/img/background-zoomed.jpg`);

    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`div p`)?.textContent).toEqual(`Welcome to Renan's PortfolioClick Here to Start`);
    expect(component.isCoverTextHidden()).toBeTrue();
  });

  it(`should show Welcome Here once image is clicked and show Click Here when zoomed Out again`, fakeAsync(() => {

    const welcomeText: string = `Welcome!\nPlease enter the command <span class="dynamicText">'help'</span> if you would like to see what you are able to do.`

    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(welcomeText));
    spyOn(component, `toggleZoomIn`).and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();

    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const imgElement: HTMLImageElement = changedCompiled.querySelectorAll(`img`)[1] as HTMLImageElement;
    expect(imgElement).toBeTruthy();
    imgElement.click();

    fixture.detectChanges();
    flush();

    // Simulate animation complete event
    const animationEvent: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEvent);
    fixture.detectChanges();

    expect(component.toggleZoomIn).toHaveBeenCalledWith(welcomeText);
    // Flush all pending observables
    flush();
    
    expect(changedCompiled.querySelector(`span`)?.textContent).toEqual(`Welcome!\nPlease enter the command 'help' if you would like to see what you are able to do.`);
    expect(component.getShowText()).toBe(true);
    expect(component.isCoverTextHidden()).toBeFalse();

    component.toggleZoomOut();

    const animationEventZoomOut: AnimationEvent = {
      fromState: `zoomedIn`,
      toState: `initial`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };

    component.onAnimationComplete(animationEventZoomOut);
    fixture.detectChanges();

    flush();
    const changedCompiledZoomedOut: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiledZoomedOut.querySelector(`span`)?.textContent).toBeFalsy();
    expect(component.getShowText()).toBe(false);
  }));

  it(`should load animated text after toggleZoomIn()`, fakeAsync(() => {
    

    const testText: string = `This is a test`;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(testText));

    component.ngOnInit();
    fixture.detectChanges();

    component.toggleZoomIn(testText);
    fixture.detectChanges();

    // Simulate animation complete event
    const animationEvent: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEvent);
    fixture.detectChanges();

    // Flush all pending observables
    flush();
    
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`span`)?.textContent).toEqual(testText);
    expect(component.getShowText()).toBe(true);
  }));

  it(`should load empty text after toggleZoomIn() with bad HTML string`, fakeAsync(() => {
    
    spyOn(sanitizer,`sanitize`).and.returnValues(null);

    const testText: string = ``;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(``));

    component.ngOnInit();
    fixture.detectChanges();

    component.toggleZoomIn(testText);
    fixture.detectChanges();

    // Simulate animation complete event
    const animationEvent: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEvent);
    fixture.detectChanges();

    // Flush all pending observables
    flush();
    
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`span`)?.textContent).toEqual(testText);
    expect(component.getShowText()).toBe(true);
  }));

  it(`should load HTML string as text after toggleZoomIn() with good HTML string`, fakeAsync(() => {
    

    const testText: string = `This is a test`;
    const testTextHtml: string = `<p>${testText}</p>`;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(testTextHtml));

    component.ngOnInit();
    fixture.detectChanges();

    component.toggleZoomIn(testTextHtml);
    fixture.detectChanges();

    // Simulate animation complete event
    const animationEvent: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEvent);
    fixture.detectChanges();

    // Flush all pending observables
    flush();
    
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`span p`)?.textContent).toEqual(testText);
    expect(component.getShowText()).toBe(true);
  }));

  it(`should change text without animation a second toggleZoomIn()`, fakeAsync(() => {
    

    component.ngOnInit();

    const testText: string = `This is a test`;
    const newText: string = `This is a new test text`;
  
    //There are 3 return calls as fixture.DetectChanges() calls the onAnimationComplete on the first zoomIn()
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValues(of(testText),of(`${testText} 2`),of(newText));
  

    //Do a ZoomIn first to trigger the show text
    component.toggleZoomIn(testText);

    // Simulate animation complete event
    const animationEventZoomIn: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEventZoomIn);
    fixture.detectChanges();

    const changed: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changed.querySelectorAll(`ul li span`)[0]?.textContent).toEqual(testText);

    // Flush all pending observables
    flush();

    //Trigger second zoomIn to make sure it changes text
    component.toggleZoomIn(newText);
    fixture.detectChanges();

    flush();
    
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelectorAll(`ul li span`)[0]?.textContent).toEqual(testText);
    expect(changedCompiled.querySelectorAll(`ul li span`)[1]?.textContent).toEqual(newText);
    expect(component.getShowText()).toBe(true);

  }));

  it(`should remove text after toggleZoomOut()`, fakeAsync(() => {
    

    const testText: string = `This is a test`;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(testText));

    component.ngOnInit();
    //Do a ZoomIn first to trigger the show text
    component.toggleZoomIn(testText);

    // Simulate animation complete event
    const animationEventZoomIn: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEventZoomIn);
    fixture.detectChanges();

    const changed: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changed.querySelector(`span`)?.textContent).toEqual(testText);
    // Flush all pending observables
    flush();

    component.toggleZoomOut();

    const animationEventZoomOut: AnimationEvent = {
      fromState: `zoomedIn`,
      toState: `initial`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEventZoomOut);
    fixture.detectChanges();

    flush();

    const changedCompiledZoomedOut: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiledZoomedOut.querySelector(`span`)?.textContent).toBeFalsy();
    expect(component.getShowText()).toBe(false);

  }));

  it(`add the entered value in input to the text array and display`, fakeAsync(() => {
    
    spyOn(homeComponent, 'setText').and.callThrough();

    const testText: string = `This is a test`;
    const testInput: string = `This is a test input`;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValues(of(testText),of(`${testText} 2`),of(testInput));

    component.ngOnInit();
    //Do a ZoomIn first to trigger the show text
    component.toggleZoomIn(testText);

    // Simulate animation complete event
    const animationEventZoomIn: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEventZoomIn);
    fixture.detectChanges();
    flush();

    const changed: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changed.querySelector(`span`)?.textContent).toEqual(testText);

    const inputElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const input: HTMLInputElement = inputElement.querySelector(`input`) as HTMLInputElement;

    component.inputText = testInput;

    // Create and dispatch the keyup event
    const event: KeyboardEvent = new KeyboardEvent(`keydown`, {
      key: `Enter`,
      code: `Enter`,
      keyCode: 13,
      bubbles: true
    });

    input.dispatchEvent(event);
    fixture.detectChanges();

    flush();

    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelectorAll(`ul li span`)[0]?.textContent).toEqual(testText);
    expect(changedCompiled.querySelectorAll(`ul li span`)[1]?.textContent).toEqual(testInput);
    expect(component.getShowText()).toBe(true);

  }));

  it(`should handled bad HTML string entered value in input and display empty string`, fakeAsync(() => {
    
    spyOn(homeComponent, 'setText').and.callThrough();

    const testText: string = `This is a test`;
    const testInput: string = `<script>console.log('This is a test input')</script>`;

    const sanitizeMock: jasmine.Spy = spyOn(sanitizer,`sanitize`);
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(testText));
    sanitizeMock.and.callThrough();

    component.ngOnInit();
    //Do a ZoomIn first to trigger the show text
    component.toggleZoomIn(testText);

    // Simulate animation complete event
    const animationEventZoomIn: AnimationEvent = {
      fromState: `initial`,
      toState: `zoomedIn`,
      totalTime: 800, // Animation duration in milliseconds
      phaseName: `done`,
      element: ``,
      triggerName: `zoomAnimation`,
      disabled: false
    };
    component.onAnimationComplete(animationEventZoomIn);
    fixture.detectChanges();
    flush();

    sanitizeMock.and.returnValue(null);

    const inputElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const input: HTMLInputElement = inputElement.querySelector(`input`) as HTMLInputElement;

    component.inputText = testInput;

    // Create and dispatch the keyup event
    const event: KeyboardEvent = new KeyboardEvent(`keydown`, {
      key: `Enter`,
      code: `Enter`,
      keyCode: 13,
      bubbles: true
    });

    input.dispatchEvent(event);
    fixture.detectChanges();

    flush();

    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(component.getPreviousTexts().length).toEqual(2);
    expect(changedCompiled.querySelectorAll(`ul li span`)[0]?.textContent).toEqual(testText);
    expect(changedCompiled.querySelectorAll(`ul li span`)[1]?.textContent).toEqual(``);
    expect(component.getShowText()).toBe(true);

  }));

  it('should scroll to the bottom of the text container', (done) => {
    // Create a mock div element for the text container
    const mockDiv = document.createElement(`div`);
    mockDiv.id = `text-container`;
    mockDiv.style.height = `200px`;
    mockDiv.style.overflow = `scroll`;
    document.body.appendChild(mockDiv);

    // Add some content to the mock div to make it scrollable
    const content = document.createElement(`div`);
    content.style.height = `1000px`;
    mockDiv.appendChild(content);

    // Spy on the getElementById method to return the mock div
    spyOn(document, `getElementById`).and.returnValue(mockDiv);

    // Call the method that triggers the scroll
    component.scrollToBottom();

    // Wait for the setTimeout to complete
    setTimeout(() => {
      // Assert that the scrollTop is set to the scrollHeight
      expect(mockDiv.scrollTop).toBe(mockDiv.scrollHeight - mockDiv.clientHeight);
      done();
    }, 0);
  });
});