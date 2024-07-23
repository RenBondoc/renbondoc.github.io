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
    const navElement: HTMLElement | null = compiled.querySelector('nav');
    expect(navElement).toBeTruthy(); // Check if nav element exists
    const listItems: NodeListOf<Element> | undefined =
      navElement?.querySelectorAll('ul li');

    if (listItems) {
      expect(listItems.length).toBe(5); // Check if there are 5 list items
      // You can further check if the anchor texts are correct if needed
      expect(listItems[0].textContent).toContain('Home');
      expect(listItems[1].textContent).toContain('About');
      expect(listItems[2].textContent).toContain('Projects');
      expect(listItems[3].textContent).toContain('Resume');
      expect(listItems[4].textContent).toContain('Contact');
    } else {
      expect(listItems).toBeTruthy();
    }
  });

  it('should emit About text on click', () => {
    spyOn(component.messageEvent, 'emit');

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;

    // Trigger the click on the "About" link
    const aboutLink: HTMLAnchorElement | null = navElement?.querySelector(`ul li:nth-child(2) a`) as HTMLAnchorElement;
    if(aboutLink) {
      aboutLink.dispatchEvent(new Event(`click`))
    } else {
      expect(aboutLink).toBeTruthy();
    }
    

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      'You are in the ABOUT page now'
    );
  });
});
