import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchedUser: any;
  searchUserSub = new Subject<{ user: any }>();
  constructor(private http: HttpClient) { }

  searchUser(name: string) {
    this.http.get<{ user: any, message: string }>("http://localhost:3000/api/search/"+ name)
        .subscribe(user => {
          this.searchedUser = user;
          this.searchUserSub.next(user)
        })
  }

  getSearchedUserListener() {
    return this.searchUserSub.asObservable();
  }
}


