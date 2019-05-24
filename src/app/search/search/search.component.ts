import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchedUsers: any[];
  userName: string;
  constructor(private searchService: SearchService) { }
  ngOnInit() {
   this.searchService.getSearchedUserListener().subscribe(result => {
     this.searchedUsers = result.user;
   })
   
  }
}
