import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from '../home/home.component';

describe(`HomeComponent`, () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should create`, () => {
    expect(component).toBeTruthy();
  });

  it(`should render navigation links`, () => {
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const navElement: HTMLElement | null = compiled.querySelector(`nav`);
    expect(navElement).toBeTruthy(); // Check if nav element exists
    const listItems: NodeListOf<Element> | undefined =
      navElement?.querySelectorAll(`ul li`);

    if (listItems) {
      expect(listItems.length).toBe(4); // Check if there are 5 list items
      // You can further check if the anchor texts are correct if needed
      expect(listItems[0].textContent).toEqual(`About`);
      expect(listItems[1].textContent).toEqual(`Projects`);
      expect(listItems[2].textContent).toEqual(`Resume`);
      expect(listItems[3].textContent).toEqual(`Contact`);
    } else {
      expect(listItems).toBeTruthy();
    }
  });

  it(`should emit About text on click`, () => {
    spyOn(component.messageEvent, `emit`);

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;

    // Trigger the click on the "About" link
    const aboutLink: HTMLAnchorElement = navElement.querySelector(`ul li:nth-child(1) a`) as HTMLAnchorElement;
    aboutLink.dispatchEvent(new Event(`click`))
    
    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      `You are in the About page now`
    );
  });

  it(`should emit void on click oh home button`, () => {
    spyOn(component.homeButton, `emit`);

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const homeButton: Element = navElement.querySelector(`button`) as Element;
    homeButton.dispatchEvent(new Event(`click`))

    fixture.detectChanges();
    expect(component.homeButton.emit).toHaveBeenCalledTimes(1);
  });

});
