import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
  selector: `app-root`,
  standalone: true,
  imports: [ 
    RouterOutlet,
    HomeComponent
  ],
  templateUrl: `./app.component.html`,
  styleUrl: `./app.component.css`
})
export class AppComponent {

  
  private text: string = `Welcome to my Mojo Dojo Cassa House`;

  getText(): string {
    return this.text;
  }

  setText($value: string): void {
    this.text = $value;
  }


}
