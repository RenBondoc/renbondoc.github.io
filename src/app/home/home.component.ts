import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  Pipe,
} from '@angular/core';

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
          left: '100%',
        })
      ),
      state(
        `down`,
        style({
          left: '0%',
        })
      ),
      transition(`up => down`, [animate(`0.5s ease-in`)]),
      transition(`down => up`, [animate(`0.5s ease-out`)]),
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
      case `contacts`:
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
    return `<span class="dynamicText">about</span>
    
    Hi there! I'm <span class="dynamicText">Renan</span>, a dedicated software developer with a Bachelor of Science in Computing from Curtin University. 
    My journey in the tech world has been fueled by a passion for problem-solving and a love for coding. 
    I specialize in back-end software development, where I thrive on creating robust, efficient solutions and adhering to best practices through a test-driven development approach.
    
    With a strong foundation in full-stack development, I excel in both front-end and back-end technologies. 
    Currently, TypeScript is my primary language, but I’m well-versed in Java, Python, Bash scripting, and have a solid understanding of C++. 
    My experience also extends to SQL and databasing, enhancing my ability to build comprehensive software solutions. 
    I favor Ubuntu for my development work but am also proficient with Windows and macOS.
    
    While I’m still new to mobile development, particularly iOS, I am actively working on personal projects to expand my skill set in this area. 
    I thrive in dynamic, high-pressure environments, where my adaptability, time management skills, and dedication shine.
    
    Outside of the coding world, I am an avid gamer who enjoys multiplayer and co-op experiences, and I stay active through cycling, basketball, and volleyball. 
    My enthusiasm for technology extends beyond work—I am genuinely fascinated by the software that makes our lives easier and more enjoyable.
    
    Feel free to explore my portfolio to see some of the projects I've worked on and learn more about my professional journey. Thanks for visiting!`;
  }

  private getProjectsText(): string {
    return `<span class="dynamicText">projects</span>
    
    Welcome to my Projects!
    

    <a target="_blank" class="dynamicText" href="https://github.com/RenBondoc/renbondoc.github.io">Portfolio</a>
            This is a simple angular application I made to get more familiar working with front-end applications.
            This project was for me to explore and showcase my angular, html and css knowledge.
            The main goal for this was to get a 100% code coverage with the unit testing, testing as much of the functionality as possible.
            I wanted to challenge myself by being able to test the web application's full functionality.

            The web application was inspired to be the ubuntu's/OSX terminal system and the windows' command prompt.
            If you're viewing this on mobile, try looking at the desktop view.

            This Project is still a current work in progress. I am trying to iron out small issues and in the process
            of updating the visual aesthetics


    I promise more projects are coming in soon!

    PS: I do plan to add some easter eggs in this app, so please do check up once in a while.
    `;
  }

  private getContactsText(): string {
    return `<span class="dynamicText">contacts</span>
    
    Loading contact links....
    
    LinkedIn: <a target="_blank" class="dynamicText" href="https://www.linkedin.com/in/renan-bondoc-7b1a53200">https://www.linkedin.com/in/renan-bondoc-7b1a53200</a>
    GitHub: <a target="_blank" class="dynamicText" href="https://github.com/RenBondoc">https://github.com/RenBondoc</a>
    
    Thank you for visiting!`;
  }

  private getDefaultText(text: string): string {
    return `The command '${text}' is not recognised. Enter <span class="dynamicText">'help'</span> to see the available commands.`;
  }

  private getResumeText(): string {
    return `<span class="dynamicText">resume</span>
    
    Downloading Resume....`;
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
      \n> <a class="dynamicText">Contacts</a>                \nWill show the multiple ways you can get in contact with me.\n

      There would hopefully be more commands to run in the future, look forward to it!`;
    } else {
      text = `Welcome to the help page!
      \nThe commands you are able to run for now are:
      > <a class="dynamicText">About</a>                  This will navigate you to the 'about' page of the app.
      > <a class="dynamicText">Projects</a>               This will navigate you to the 'projects' page of the app.
      > <a class="dynamicText">Resume</a>                 This will download my resume for you.
      > <a class="dynamicText">Contacts</a>                Will show the multiple ways you can get in contact with me.

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
