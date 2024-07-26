import { fakeAsync, TestBed } from '@angular/core/testing';

import { TypewriterService } from '../services/typewriter.service';
import { interval, map, take } from 'rxjs';

describe('TypewriterService', () => {
  let service: TypewriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypewriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit substrings of word at specified intervals', (done: DoneFn) => {
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

  it('should emit void getButton is called()', (done: DoneFn) => {
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
});
