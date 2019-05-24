import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import{ mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = "create";
  private postId: string;
  form: FormGroup;
  post: Post;
  isLoading = false;
  imagePreview: string|ArrayBuffer;
  constructor(private postsService: PostsService, public route: ActivatedRoute) { 
  }
  
  ngOnInit() {
    this.form = new FormGroup({
      postTitle: new FormControl(null, { 
        validators: [Validators.required, Validators.minLength(3)] 
      }),
      postContent: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { 
        validators: [Validators.required], 
        asyncValidators:[mimeType] 
      })
    }),
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = "edit";
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe((result) => {
            this.isLoading = false;
            this.post = { 
              postId: result._id, 
              postTitle: result.postTitle, 
              postContent: result.postContent, 
              imagePath: result.imagePath,
              creator: result.creator };
            this.form.setValue({ 
              'postTitle': this.post.postTitle, 
              'postContent': this.post.postContent,
              'image':  this.post.imagePath
            });
          });

      }else{
        this.mode = "create";
        this.postId = null;
      } 
    })
  }

  onImagePicked(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if(this.form.invalid){
      return
    }
    this.isLoading = true;
    const title = this.form.value.postTitle;
    const content = this.form.value.postContent;
    const image = this.form.value.image;
    
    if(this.mode === 'create'){
      this.postsService.onAddPost(title,content,image);
    }else{
      this.postsService.updattePost(this.postId,title,content,image);
    }
    this.form.reset();
    this.isLoading = false;
  }
}
