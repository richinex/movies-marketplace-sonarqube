/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import this
import { ApiService } from './api.service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule] // Add this line
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService); // Use get instead of inject
    expect(service).toBeTruthy();
  });
});
