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

  it(`should emit Default text if setText() not called with known command`, () => {
    spyOn(component.messageEvent, `emit`);

    // trigger the click
    component.setText(`Unknown`);

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      `The command 'unknown' is not recognised. Enter 'help' to see the available commands.`
    );
  });

  it(`should emit '' text if setText() is called with empty string`, () => {
    spyOn(component.messageEvent, `emit`);

    // trigger the click
    component.setText(``);

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(``);
  });

  it(`should emit Help text if setText() is called with 'help'`, () => {
    spyOn(component.messageEvent, `emit`);

    const helpText: string = `Welcome to the help page!
      \nThe commands you are able to run for now are:
      > <a class="dynamicText">About</a>                  This will navigate you to the 'about' page of the app.
      > <a class="dynamicText">Projects</a>               This will navigate you to the 'projects' page of the app.
      > <a class="dynamicText">Resume</a>                 This will download my resume for you.
      > <a class="dynamicText">Contact</a>                Will show the multiple ways you can get in contact with me.

      There would hopefully be more commands to run in the future, look forward to it!`

    // trigger the click
    component.setText(`help`);

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(helpText);

    component.setText(`h`);
    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(helpText);
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

  it(`should emit Projects text on click`, () => {
    spyOn(component.messageEvent, `emit`);

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;

    // Trigger the click on the "About" link
    const aboutLink: HTMLAnchorElement = navElement.querySelector(`ul li:nth-child(2) a`) as HTMLAnchorElement;
    aboutLink.dispatchEvent(new Event(`click`))

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      `You are in the Projects page now`
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
    expect(component.messageEvent.emit).toHaveBeenCalledWith(`Loading contact links....\nLinkedIn: <a target="_blank" class="dynamicText" href="https://www.linkedin.com/in/renan-bondoc-7b1a53200">https://www.linkedin.com/in/renan-bondoc-7b1a53200</a>\nGitHub: <a target="_blank" class="dynamicText" href="https://github.com/RenBondoc">https://github.com/RenBondoc</a>\n\nThank you for visiting!`);
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

  it(`should download resume and print message when resume button is clicked`, fakeAsync(() => {
    const linkElement: HTMLAnchorElement = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(linkElement);
    spyOn(component.messageEvent, `emit`);
    spyOn(component, `triggerResumeDownload`).and.callThrough();
    spyOn(linkElement, 'click');
    

    // trigger the click
    const navElement: HTMLElement = fixture.nativeElement as HTMLElement;
    const resumeLink: HTMLAnchorElement = navElement.querySelector(`ul li:nth-child(3) a`) as HTMLAnchorElement;
    expect(resumeLink).toBeTruthy();

    resumeLink.dispatchEvent(new Event(`click`))

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(
      `Downloading Resume....`
    );

    tick(3000);

    expect(component.triggerResumeDownload).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith(`a`);
    expect(linkElement.href).toContain(`/assets/doc/Renan-Bondoc-Resumev3.pdf`);
    expect(linkElement.download).toBe(`ren_bondoc_resume.pdf`);
    expect(linkElement.click).toHaveBeenCalled();

  }));

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

  it(`should emit Help text if setText() is called with 'help' mobile version`, () => {
    spyOn(component.messageEvent, `emit`);
    component.isMobile = true;
    fixture.detectChanges();

    const helpText: string = `Welcome to the help page!
      \nThe commands you are able to run for now are:
      \n> <a class="dynamicText">About</a>                  \nThis will navigate you to the 'about' page of the app.\n
      \n> <a class="dynamicText">Projects</a>               \nThis will navigate you to the 'projects' page of the app.\n
      \n> <a class="dynamicText">Resume</a>                 \nThis will download my resume for you.\n
      \n> <a class="dynamicText">Contact</a>                \nWill show the multiple ways you can get in contact with me.\n

      There would hopefully be more commands to run in the future, look forward to it!`

    // trigger the click
    component.setText(`help`);

    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(helpText);

    component.setText(`h`);
    fixture.detectChanges();
    expect(component.messageEvent.emit).toHaveBeenCalledWith(helpText);
  });

  it(`should hide dropdown when clicked again`, fakeAsync(() => {
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

    menu.dispatchEvent(new Event(`click`))
    tick(550);

    fixture.detectChanges();

    expect(component.getDropDown()).toBeFalse();
    expect(component.getAnimationSate()).toEqual(`up`);

  }));

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
