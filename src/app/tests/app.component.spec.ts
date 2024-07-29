import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationEvent } from '@angular/animations';
import { TypewriterService } from '../services/typewriter.service';
import { of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

describe(`AppComponent`, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let typewriterService: TypewriterService;

  let breakpointObserver: BreakpointObserver;
  let breakpointObserverMock: { observe: jasmine.Spy };
  let mockBreakpointState: BreakpointState

  beforeEach(async () => {

    breakpointObserverMock = {
      observe: jasmine.createSpy(`observe`)
    };

    mockBreakpointState = {
      matches: false,
      breakpoints: {
        '(max-width: 599px)': false
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BrowserAnimationsModule
      ],
      providers: [
        TypewriterService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(AppComponent);
    component= fixture.componentInstance;
    typewriterService = TestBed.inject(TypewriterService);
    breakpointObserver = TestBed.inject(BreakpointObserver);
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
    breakpointObserverMock.observe.and.returnValue(of(mockBreakpointState));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.getIsMobile()).toBeTrue();
    //Currently not changing backgroun image, but feature is possible >> Still a work in progress
    expect(component.getBackgroundImg()).toBe(`../assets/img/mobile_background_closeup.jpg`);
  });

  it(`should set isMobile to false when handset breakpoint does not match`, () => {
    breakpointObserverMock.observe.and.returnValue(of(mockBreakpointState));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.getIsMobile()).toBeFalse();
    expect(component.getBackgroundImg()).toBe(`../assets/img/background.jpg`);
  });

  it(`should load animated text after toggleZoomIn()`, fakeAsync(() => {
    breakpointObserverMock.observe.and.returnValue(of(mockBreakpointState));

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
    expect(changedCompiled.querySelector(`span`)?.textContent).toEqual(`:~$ ${testText}`);
    expect(component.getShowText()).toBe(true);
  }));

  it(`should change text without animation a second toggleZoomIn()`, fakeAsync(() => {
    breakpointObserverMock.observe.and.returnValue(of(mockBreakpointState));

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
    expect(changed.querySelectorAll(`ul li span`)[0]?.textContent).toEqual(`:~$ ${testText}`);

    // Flush all pending observables
    flush();

    //Trigger second zoomIn to make sure it changes text
    component.toggleZoomIn(newText);
    fixture.detectChanges();

    flush();
    
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelectorAll(`ul li span`)[0]?.textContent).toEqual(`:~$ ${testText}`);
    expect(changedCompiled.querySelectorAll(`ul li span`)[1]?.textContent).toEqual(`:~$ ${newText}`);
    expect(component.getShowText()).toBe(true);

  }));

  it(`should remove text after toggleZoomOut()`, fakeAsync(() => {
    breakpointObserverMock.observe.and.returnValue(of(mockBreakpointState));

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
    expect(changed.querySelector(`span`)?.textContent).toEqual(`:~$ ${testText}`);
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
    const changedCompiledZoomedOut: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiledZoomedOut.querySelector(`span`)?.textContent).toBeFalsy();
    expect(component.getShowText()).toBe(false);

  }));
});