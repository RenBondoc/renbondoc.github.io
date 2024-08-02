import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, Pipe } from '@angular/core';

@Component({
  selector: `app-home`,
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./home.component.html`,
  styleUrl: `./home.component.css`,
  animations: [
    trigger(`slideAnimation`, [
      state(
        `up`,
        style({
          transform: `translateY(-300px)`,
        })
      ),
      state(
        `down`,
        style({
          transform: `translateY(0px)`,
        })
      ),
      transition(`up => down`, [animate(`0.5s`)]),
      transition(`down => up`, [animate(`0.5s`)]),
    ]),
  ],
})
export class HomeComponent {
  @Output() messageEvent = new EventEmitter<string>();
  @Output() homeButton = new EventEmitter<null>();
  @Input() isMobile: boolean;

  private showDropDown: boolean;
  private animationState: string;

  private document: Document = inject(DOCUMENT);

  constructor() {
    this.isMobile = false;
    this.showDropDown = false;
    this.animationState = `up`;
  }

  setText(event: string): void {
    event = event.toLowerCase();

    switch (event) {
      case `resume`:
        this.messageEvent.emit(this.getResumeText());
        this.triggerResumeDownload();
        break;
      case `contact`:
        this.messageEvent.emit(this.getContactsText());
        break;
      case `about`:
        this.messageEvent.emit(this.getAboutText());
        break;
      case `projects`:
        this.messageEvent.emit(this.getProjectsText());
        break;
      case `help`:
      case `h`:
        this.messageEvent.emit(this.getHelpText());
        break;
      case ``:
        this.messageEvent.emit(``);
        break;
      default:
        this.messageEvent.emit(this.getDefaultText(event));
        break;
    }

    if (this.showDropDown) {
      this.hideDropdown();
    }
  }

  private getAboutText(): string {
    return `You are in the About page now`;
  }

  private getProjectsText(): string {
    return `Welcome to my Projects!
    

    <a target="_blank" class="dynamicText" href="https://github.com/RenBondoc/renbondoc.github.io">Portfolio</a>
            This is a simple angular application I made to get more familiar working with front-end applications.
            This project allowed me to learn a few more things with the angular framework.
            The main goal for this was to get a 100% code coverage with the unit testing.
            Challenge myself by being able to test the web application's full functionality.

            The web application was inspired to be the ubuntu's/OSX terminal system and the windows' command prompt.
            If you're viewing this on mobile, try looking at the desktop view.

            This Project is still a current work in progress. I am trying to iron out small issues and in the process
            of updating the visual aesthetics


    I promise more projects are coming in soon!

    PS: I do plan to add some easter eggs in this app, so please do check up once in a while.
    `;
  }

  private getContactsText(): string {
    return `Loading contact links....\nLinkedIn: <a target="_blank" class="dynamicText" href="https://www.linkedin.com/in/renan-bondoc-7b1a53200">https://www.linkedin.com/in/renan-bondoc-7b1a53200</a>\nGitHub: <a target="_blank" class="dynamicText" href="https://github.com/RenBondoc">https://github.com/RenBondoc</a>\n\nThank you for visiting!`;
  }

  private getDefaultText(text: string): string {
    return `The command '${text}' is not recognised. Enter 'help' to see the available commands.`;
  }

  private getResumeText(): string {
    return `Downloading Resume....`;
  }
  
  triggerResumeDownload(): void {
    setTimeout(() => {
      const link: HTMLAnchorElement = document.createElement(`a`);
      link.href = `../../assets/doc/Renan-Bondoc-Resumev3.pdf`;
      link.download = `ren_bondoc_resume.pdf`;
      link.target = `_blank`;
      link.click();
    }, 2500); // Adjust the delay as needed to ensure the text is displayed first
  }

  private getHelpText(): string {
    let text: string = ``;

    if (this.isMobile) {
      text = `Welcome to the help page!
      \nThe commands you are able to run for now are:
      \n> <a class="dynamicText">About</a>                  \nThis will navigate you to the 'about' page of the app.\n
      \n> <a class="dynamicText">Projects</a>               \nThis will navigate you to the 'projects' page of the app.\n
      \n> <a class="dynamicText">Resume</a>                 \nThis will download my resume for you.\n
      \n> <a class="dynamicText">Contact</a>                \nWill show the multiple ways you can get in contact with me.\n

      There would hopefully be more commands to run in the future, look forward to it!`;
    } else {
      text = `Welcome to the help page!
      \nThe commands you are able to run for now are:
      > <a class="dynamicText">About</a>                  This will navigate you to the 'about' page of the app.
      > <a class="dynamicText">Projects</a>               This will navigate you to the 'projects' page of the app.
      > <a class="dynamicText">Resume</a>                 This will download my resume for you.
      > <a class="dynamicText">Contact</a>                Will show the multiple ways you can get in contact with me.

      There would hopefully be more commands to run in the future, look forward to it!`;
    }

    return text;
  }

  homeButtonClick(): void {
    this.homeButton.emit();

    if (this.showDropDown) {
      this.showDropDown = false;
    }
  }

  private async hideDropdown(): Promise<void> {
    this.animationState = `up`;
    await new Promise((resolve) => setTimeout(resolve, 550));
    this.showDropDown = false;
  }

  async toggleDropdown(): Promise<void> {
    //The order of this code matters
    console.log(`Checking dropdown: ${this.showDropDown}`);
    if (this.showDropDown) {
      this.hideDropdown();
    } else {
      this.showDropDown = true;
      this.animationState = `down`;
    }
  }

  getDropDown(): boolean {
    return this.showDropDown;
  }

  getAnimationSate(): string {
    return this.animationState;
  }
}
