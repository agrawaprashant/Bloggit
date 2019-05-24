import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  updateProfilePicture(profilePicture: File) {
    const postData = new FormData();
    const userId = this.authService.getUserData().userId; 
    postData.append("image",profilePicture, userId);
    return this.http.put<{ message: string }>("http://localhost:3000/api/user/profile/image/" + userId, postData);
  }

  getuserPrfile() {
    const userId = this.authService.getUserData().userId;
    return this.http.get<{ firstName: string, lastName: string, profileImage: string }>("http://localhost:3000/api/user/profile/"+ userId)
  }

  getPostCreatorData(creatorId: string){
    return this.http.get<{ firstName: string, lastName: string, profileImage: string }>("http://localhost:3000/api/user/profile/"+ creatorId);
  }

}
