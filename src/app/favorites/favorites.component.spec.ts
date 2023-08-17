import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import for router testing
import { HttpClientTestingModule } from '@angular/common/http/testing'; // If ApiService uses HttpClient
import { FavoritesComponent } from './favorites.component';
import { ApiService } from '../api.service'; // If ApiService is used

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule], // Add these lines for router and HttpClient testing
      providers: [ApiService] // If ApiService is used
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
