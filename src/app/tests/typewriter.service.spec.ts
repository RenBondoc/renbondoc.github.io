import { TestBed } from '@angular/core/testing';

import { TypewriterService } from '../services/typewriter.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('TypewriterService', () => {
  let service: TypewriterService;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypewriterService);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it(`should be created`, () => {
    expect(service).toBeTruthy();
  });

  it(`should emit substrings of word at specified intervals`, (done: DoneFn) => {
    const word = `Testing`;

    let result: Array<string> = [];

    service.getTypewriterEffect([word]).subscribe({
      next: (substring: string) => {
        result.push(substring);
      },
      complete: () => {
        expect(result).toEqual([`T`, `Te`, `Tes`, `Test`, `Testi`, `Testin`, `Testing`]);
        expect(result.length).toEqual(word.length);
        done();
      }
    });
  });

  it(`should emit empty string when unsafe HTML is entered`, (done: DoneFn) => {
    spyOn(sanitizer,`sanitize`).and.returnValue(null);
    const word = `<script>alert('Hello!');</script>`;

    let result: Array<string> = [];

    service.getTypewriterEffect([word]).subscribe({
      next: (substring: string) => {
        result.push(substring);
      },
      complete: () => {
        expect(result).toEqual([]);
        expect(result.length).toEqual(0);
        done();
      }
    });
  });
});
