import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string;
  form: FormGroup;
  imagePreview: string;
  userData = {
    firstName: '',
    lastName: '',
    profileImage: ''
  }
  constructor(private authService: AuthService, private usrProfileService: UserProfileService) { }

  ngOnInit() {
    this.form = new FormGroup({
      profileImage: new FormControl(null,{
        asyncValidators: [mimeType]
      })
    });
    this.usrProfileService.getuserPrfile()
      .subscribe(userProfile => {
        this.userData.firstName = userProfile.firstName;
        this.userData.lastName = userProfile.lastName;
        this.userData.profileImage = userProfile.profileImage
        console.log(userProfile)
      })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({profileImage: file});
    this.form.get('profileImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string)
    }
    reader.readAsDataURL(file);
    const profilePicture = this.form.get('profileImage').value;
    this.usrProfileService.updateProfilePicture(profilePicture).subscribe(result => {
      alert(result.message)
    })
  }

  
}
