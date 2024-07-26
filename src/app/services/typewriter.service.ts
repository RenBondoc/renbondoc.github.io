import { Injectable } from '@angular/core';
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
  repeat,
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
  constructor() {}

  private type(typeString: TypeParams): Observable<string> {
    const word: string = typeString.word;
    const speed: number = typeString.speed;

    return interval(speed).pipe(
      map((letterN: number) => word.substring(0, letterN + 1)),
      take(word.length)
    );
  }

  private typeEffect(word: string): Observable<string> {
    const typeString: TypeParams = {
      word: word,
      speed: 50,
    };

    return concat(
      this.type(typeString),
      of(``).pipe(delay(1200), ignoreElements())
    );
  }

  getTypewriterEffect(titles: string[]): Observable<string> {
    return from(titles).pipe(concatMap((title) => this.typeEffect(title)));
  }
}
