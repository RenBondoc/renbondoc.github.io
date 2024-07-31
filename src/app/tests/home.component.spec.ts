import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HomeComponent } from '../home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe(`HomeComponent`, () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        BrowserAnimationsModule
      ],
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

  it(`should emit Contact text on click`, () => {
    spyOn(component.messageEvent, `emit`);

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;

    // Trigger the click on the "About" link
    const aboutLink: HTMLAnchorElement = navElement.querySelector(`ul li:nth-child(4) a`) as HTMLAnchorElement;
    aboutLink.dispatchEvent(new Event(`click`))

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(`Loading contact links....\nLinkedIn: <a target="_blank" href="https://www.linkedin.com/in/renan-bondoc-7b1a53200"><img class="text spanImage" src="../assets/img/linkedin.png"></a>\nGitHub: <a target="_blank" href="https://github.com/RenBondoc"><img class="text spanImage" src="../assets/img/social.png"></a>\n\nThank you for visiting!`);
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

  it(`should download resume and print message when resume button is clicked`, () => {
    spyOn(component.messageEvent, `emit`);
    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const resumeLink: HTMLAnchorElement = navElement.querySelector(`ul li:nth-child(3) a`) as HTMLAnchorElement;
    expect(resumeLink).toBeTruthy();
    expect(resumeLink.href).toContain(`Renan-Bondoc-Resumev3.pdf`)
    expect(resumeLink.download).toBe(`ren_bondoc_resume`);


    resumeLink.dispatchEvent(new Event(`click`))

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      `Downloading resume.....`
    );
  });

  it(`should show a menu button during mobile view and show a dropdown when clicked`, () => {
    spyOn(component.messageEvent, `emit`);
    component.isMobile = true;
    fixture.detectChanges();

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const menu: HTMLButtonElement = navElement.querySelectorAll(`button`)[1] as HTMLButtonElement;
    expect(menu).toBeTruthy();

    menu.dispatchEvent(new Event(`click`))
    fixture.detectChanges();

    expect(component.getDropDown()).toBeTrue();
    expect(component.getAnimationSate()).toEqual(`down`);
    const dropDownList: HTMLAnchorElement = navElement.querySelector(`ul li:nth-child(1) a`) as HTMLAnchorElement;
    dropDownList.dispatchEvent(new Event(`click`))

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      `You are in the About page now`
    );

  });

  it(`should hide dropdown when home button is clicked`, fakeAsync(() => {
    spyOn(component.messageEvent, `emit`);
    spyOn(component.homeButton, `emit`);
    component.isMobile = true;
    fixture.detectChanges();

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const menu: HTMLButtonElement = navElement.querySelectorAll(`button`)[1] as HTMLButtonElement;
    expect(menu).toBeTruthy();

    menu.dispatchEvent(new Event(`click`))
    fixture.detectChanges();

    expect(component.getDropDown()).toBeTrue();
    expect(component.getAnimationSate()).toEqual(`down`);
    const homeButton: HTMLButtonElement = navElement.querySelectorAll(`button`)[0] as HTMLButtonElement;
    homeButton.dispatchEvent(new Event(`click`))

    tick(550);

    fixture.detectChanges();
    expect(component.homeButton.emit).toHaveBeenCalledTimes(1);
    expect(component.getDropDown()).toBeFalse();
    expect(component.getAnimationSate()).toEqual(`down`);

  }));

});
