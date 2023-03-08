import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  private mode = 'create';
  private postId: string;
  // imagePreview:string;
  form: FormGroup;
  isLoading = false;
  post: Post;
  constructor(private postService: PostService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null,{validators:[Validators.required]})
      // image: new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, content: postData.content }
          this.form.setValue({
            title:this.post.title,
            content:this.post.content
          });
        });
        console.log(this.post)
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  // onImagePicked(event:Event){
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({image:file})
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = ()=>{
  //     this.imagePreview = reader.result as string;
  //   }
  //   reader.readAsDataURL(file);

  //   console.log(file)
  //   console.log(this.form)
  // }

  onSubmit() {
    console.log(this.form.value)
     if (this.form.invalid) {
      return
    }
    if (this.mode == 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    }
    else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset()

  }
}
