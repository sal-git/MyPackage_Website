/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PackagesService } from './packages.service';

describe('PackagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackagesService]
    });
  });

  it('should ...', inject([PackagesService], (service: PackagesService) => {
    expect(service).toBeTruthy();
  }));
});
