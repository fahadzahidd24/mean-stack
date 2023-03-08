import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';
@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent{
  posts:Post[] = [];
  postsPerPage = 2;
  totalPosts = 10;
  currentPage = 1
  pageSizeOptions = [1,2,5,10];
  isLoading = false;
  private postSub:Subscription;
  constructor(private postsService:PostService) { }
  ngOnInit(){
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.isLoading = true;
    this.postSub = this.postsService.getPostUpdateListener().subscribe((posts:Post[]) => {
      this.isLoading = false;
      this.posts = posts;
      });
  }

  onPageChange(pageData:PageEvent){
    // this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postsService.getPosts(this.postsPerPage,this.currentPage)
    // this.isLoading = false
    // console.log(event);
  }


  onDelete(postId:string){
    this.postsService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
