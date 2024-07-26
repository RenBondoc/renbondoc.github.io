import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationEvent } from '@angular/animations';
import { TypewriterService } from '../services/typewriter.service';
import { Observable, of } from 'rxjs';

describe(`AppComponent`, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let typewriterService: TypewriterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BrowserAnimationsModule
      ],
      providers: [
        TypewriterService
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(AppComponent);
    component= fixture.componentInstance;
    typewriterService = TestBed.inject(TypewriterService);
  });

  it(`should create the app`, () => {
    expect(component).toBeTruthy();
  });

  it(`should load animated text after toggleZoomIn()`, fakeAsync(() => {
    const testText: string = `This is a test`;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(testText));

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

  it(`should change text without animation a second toggleZoomIn()`, fakeAsync(() => {
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
    expect(changed.querySelector(`span`)?.textContent).toEqual(testText);

    // Flush all pending observables
    flush();

    //Trigger second zoomIn to make sure it changes text
    component.toggleZoomIn(newText);
    fixture.detectChanges();

    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`span`)?.textContent).toEqual(newText);
    expect(component.getShowText()).toBe(true);

  }));

  it(`should remove text after toggleZoomOut()`, fakeAsync(() => {
    const testText: string = `This is a test`;
    spyOn(typewriterService, `getTypewriterEffect`).and.returnValue(of(testText));

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
