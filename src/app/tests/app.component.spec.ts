import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../app.component';

describe(`AppComponent`, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it(`should create the app`, () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Welcome to my Mojo Dojo Cassa House' text`, () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.componentInstance;
    expect(app.getText()).toEqual(`Welcome to my Mojo Dojo Cassa House`);
  });

  it(`should render title`, () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector(`div`)?.textContent).toContain(`Hello, Welcome to my Mojo Dojo Cassa House`);
  });

  it(`should change title after calling setText()`, () => {

    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const component: AppComponent = fixture.componentInstance;

    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector(`div`)?.textContent).toContain(`Hello, Welcome to my Mojo Dojo Cassa House`);
    
    component.setText(`This is a test`);
    fixture.detectChanges();
    const changedCompiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(changedCompiled.querySelector(`div`)?.textContent).toContain(`This is a test`);
    

  });
});
