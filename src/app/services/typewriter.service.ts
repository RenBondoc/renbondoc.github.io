import { inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';
import {
  concat,
  concatMap,
  delay,
  from,
  ignoreElements,
  interval,
  map,
  Observable,
  of,
  take,
} from 'rxjs';

interface TypeParams {
  word: string;
  speed: number;
}

@Injectable({
  providedIn: `root`,
})
export class TypewriterService {

  private sanitizer: DomSanitizer = inject(DomSanitizer);

  constructor() {}

  private type(typeString: TypeParams): Observable<string> {
    const word: string = typeString.word;
    const speed: number = typeString.speed;

    return interval(speed).pipe(
      map((letterN: number) => word.substring(0, letterN + 1)),
      take(word.length)
    );
  }

  private typeEffect(word: SafeValue): Observable<string> {
    const text: string = this.sanitizer.sanitize(SecurityContext.HTML, word) ?? ``;
    const typeString: TypeParams = {
      word: text,
      speed: 30,
    };

    return concat(
      this.type(typeString),
      of(``).pipe(delay(1200), ignoreElements())
    );
  }

  getTypewriterEffect(titles: Array<SafeValue>): Observable<string> {
    return from(titles).pipe(concatMap((title) => this.typeEffect(title)));
  }
}
