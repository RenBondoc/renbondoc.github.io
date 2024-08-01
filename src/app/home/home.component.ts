import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Pipe } from '@angular/core';


@Component({
  selector: `app-home`,
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: `./home.component.html`,
  styleUrl: `./home.component.css`,
  animations: [
    trigger(`slideAnimation`, [
      state(`up`, style({
        transform: `translateY(-300px)`,
      })),
      state(`down`, style({
        transform: `translateY(0px)`,
      })),
      transition(`up => down`, [
        animate(`0.5s`)
      ]),
      transition(`down => up`, [
        animate(`0.5s`)
      ])
    ])
  ]
})
export class HomeComponent {

  @Output() messageEvent = new EventEmitter<string>();
  @Output() homeButton = new EventEmitter<null>();
  @Input() isMobile: boolean;

  private showDropDown: boolean ;
  private animationState: string;

  constructor() {
    this.isMobile = false;
    this.showDropDown = false;
    this.animationState = `up`;
  }

  setText(event: string): void {

    event = event.toLowerCase();

    switch(event) {
      case `resume`:
        this.messageEvent.emit(`Downloading resume.....`);
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
    return `You are in the Projects page now`;
  }

  private getContactsText(): string {
    return `Loading contact links....\nLinkedIn: <a target="_blank" href="https://www.linkedin.com/in/renan-bondoc-7b1a53200"><img class="text spanImage" src="../assets/img/linkedin.png"></a>\nGitHub: <a target="_blank" href="https://github.com/RenBondoc"><img class="text spanImage" src="../assets/img/social.png"></a>\n\nThank you for visiting!`;
  }

  private getDefaultText(text: string): string {
    return `The command '${text}' is not recognised. Enter 'help' to see the available commands.`
  }

  private getHelpText(): string {
    let text: string = ``;

    if(this.isMobile) {
      text =`Welcome to the help page!
      \nThe command you are able to run for now are:
      \n> About                  \nThis will navigate you to the 'about' page of the app.\n
      \n> Projects               \nThis will navigate you to the 'projects' page of the app.\n
      \n> Resume                 \nThis will download my resume for you.\n
      \n> Contact                \nWill show the multiple ways you can get in contact with me.\n

      There would hopefully be more commands to run in the future, look forward to it!`
    } else {
      text = `Welcome to the help page!
      \nThe command you are able to run for now are:
      > About                  This will navigate you to the 'about' page of the app.
      > Projects               This will navigate you to the 'projects' page of the app.
      > Resume                 This will download my resume for you.
      > Contact                Will show the multiple ways you can get in contact with me.

      There would hopefully be more commands to run in the future, look forward to it!`
    }
     
    return text;
  }

  homeButtonClick(): void {
    this.homeButton.emit();

    if(this.showDropDown) {
      this.showDropDown = false;
    }
  }

  private async hideDropdown(): Promise<void> {
    this.animationState = `up`;
    await new Promise( resolve => setTimeout(resolve, 550) );
    this.showDropDown = false;
  }

  async toggleDropdown(): Promise<void> {
    //The order of this code matters
    console.log(`Checking dropdown: ${this.showDropDown}`)
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

