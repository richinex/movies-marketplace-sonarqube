/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL = environment.apiURL;

  constructor(private httpClient: HttpClient) {} // Change to httpClient

  public addToFavorites(movie) {
    return this.httpClient
      .post(`${this.BASE_URL}/favorites`, movie)
      .pipe(map(res => res)); // HttpClient automatically does .json()
  }

  public getFavorites() {
    return this.httpClient
      .get(`${this.BASE_URL}/favorites`)
      .pipe(map(res => res));
  }

  public getMovies() {
    return this.httpClient
      .get(`${this.BASE_URL}/movies`)
      .pipe(map(res => res));
  }

  public getMovie(id) {
    return this.httpClient
      .get(`${this.BASE_URL}/movies/${id}`)
      .pipe(map(res => res));
  }
}
