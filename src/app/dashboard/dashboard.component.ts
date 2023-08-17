/* tslint:disable */

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private movies: Array<any> = new Array<any>();
  public keyword: string;

  constructor(private apiService: ApiService) {
    this.getMovies();
  }

  private getMovies(){
    this.apiService.getMovies().subscribe((data: any[]) => { // Explicitly set the type here
      this.movies = data;
    }, err => {
      this.movies = [];
    });
  }

  ngOnInit() {
  }

  public searchMovie(){
    this.apiService.getMovie(this.keyword).subscribe((data: any) => { // Explicitly set the type here
      this.movies = [];
      if (Array.isArray(data))
        this.movies = data as any[]; // Use 'as' to cast the type if needed
      else
        this.movies.push(data);
    }, err => {
      this.movies = [];
    });
  }
}
