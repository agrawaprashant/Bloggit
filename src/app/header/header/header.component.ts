import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authStatusSub: Subscription;
  authStatus = false;
  isLoading = false;
  userName: string;
  constructor(private authService: AuthService, private searchService: SearchService) { }

  ngOnInit() {
    this.userName = this.authService.getUserData().firstName;
    this.authStatus = this.authService.getIsAuth();
    this.authStatusSub =  this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
     this.authStatus = isAuthenticated;
   });
   this.authService.getLoginListener().subscribe(userName => {
     this.userName = userName;
   })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    // this.userName = null;
  }

  onSearch(searchForm: NgForm) {
    const name = searchForm.value.name;
    this.searchService.searchUser(name)
  }

}
