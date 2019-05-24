import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Post } from '../models/post-model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private post: Post[] = []
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
   }

  onAddPost(postTitle: string, postContent: string, image: File) {
    const postData = new FormData();
    postData.append("postTitle", postTitle);
    postData.append("postContent", postContent);
    postData.append("image", image, postTitle);
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(result =>{
        const post:Post = {'postId': result.post.postId, 
                           'postTitle': postTitle, 
                           'postContent': postContent,
                            'imagePath': result.post.imagePath,
                            'creator': result.post.creator
                          };
        this.post.push(post);
        this.postUpdated.next([...this.post]);
        this.router.navigate(['']);
      })
  }

  getPost(postId: string ){
    return this.http.get<{ _id: string, 
                           postTitle: string, 
                           postContent: string, 
                           imagePath: string, 
                           creator: string 
                          }
        >('http://localhost:3000/api/posts/' + postId);
  }
  getPosts() {
    this.http.get<{ message: string, posts: any }>(
        'http://localhost:3000/api/posts'
        )
        .pipe(map((postData) =>{
          return postData.posts.map((post) => {
            return {
              postTitle: post.postTitle,
              postContent: post.postContent,
              postId: post._id,
              imagePath: post.imagePath,
              creator: post.creator
              }
            })
        }))
        .subscribe((transformedPosts) => {
        this.post = transformedPosts;
        this.postUpdated.next([...this.post]);
      });
  }

  removePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe((result) => {
        const updatedPosts = this.post.filter(post => post.postId !== postId);
        this.post = updatedPosts;
        this.postUpdated.next([...this.post]); 
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  updattePost(id: string, postTitle: string, postContent: string, image:File|string) {
    let postData: Post|FormData;
    if(typeof(image) === 'object'){
      postData =  new FormData();
      postData.append("postId", id);
      postData.append("postTitle",postTitle);
      postData.append("postContent",postContent);
      postData.append("image",image,postTitle);
    }else{
      postData = {
        'postId': id,
        'postTitle': postTitle,
        'postContent': postContent,
        'imagePath': image,
        'creator' : null 
      } 
    }
    this.http.put('http://localhost:3000/api/posts/'+ id , postData)
      .subscribe((res) => {
        const updatedPost = [...this.post];
        const oldPostIndex = updatedPost.findIndex(p => p.postId === id);
        const post: Post = {
          'postId': id,
          'postTitle': postTitle,
          'postContent': postContent,
          'imagePath': '',
          'creator': this.authService.getUserData().userId
         }
        updatedPost[oldPostIndex] = post;
        this.post = updatedPost;
        this.postUpdated.next([...this.post]);
        this.router.navigate(['/']);
      })
  }
}
