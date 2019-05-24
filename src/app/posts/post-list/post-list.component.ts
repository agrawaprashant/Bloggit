import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post-model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts :Post[] = [];
  creatorImages = [];
  isLoading = false;
  userId: string;
  private postSub: Subscription;
  authStatus = false;
  private authStatusSub: Subscription;
  constructor(private postService: PostsService, private authService: AuthService, private usrProfileService: UserProfileService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    try{
      this.userId = this.authService.getUserData().userId;
    }catch{
      return
    }

    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
      this.authStatus = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.authStatus = isAuthenticated;
        try{
          this.userId = this.authService.getUserData().userId;
        }catch{
          return
        }
        for(let i=0; i<this.posts.length; i++){
          this.usrProfileService.getPostCreatorData(this.posts[i].creator)
            .subscribe(creatorData => {
              this.creatorImages.push(creatorData.profileImage);
            });
        }
        console.log(this.creatorImages);
      });
      
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onRemove(postId: string) {
    this.postService.removePost(postId);
  }
}
