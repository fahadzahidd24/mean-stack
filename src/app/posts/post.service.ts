import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postPerPage:number,currentPage:number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts' + queryParams).pipe(map(responseData => {
      return responseData.posts.map((postData) => {
        return {
          title: postData.title,
          content: postData.content,
          id: postData._id
        };
      });
    })).subscribe((transformedData) => {
      this.posts = transformedData;
      this.postsUpdated.next([...this.posts])

    })

  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    // const postData = new FormData();
    // postData.append('title', title);
    // postData.append('content', content);
    // postData.append('image', image, title);

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post).subscribe(responseData => {
      //
      // const post: Post = { id: responseData.postId, title: title, content: content };
      //
      this.router.navigate(['/'])
      console.log(responseData.message)
      post.id = responseData.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + postId);
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = { id: postId, title: title, content: content }
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + postId, post).subscribe(responseData => {
      console.log(responseData.message);
      this.router.navigate(['/'])
      const updatedPosts = [...this.posts]
      const oldPostIndex = updatedPosts.findIndex(post => post.id == postId)
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }

  deletePost(postId: string) {
    this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId).subscribe(responseData => {
      console.log(responseData.message)
      // this.getPosts();
      const updatedPosts = this.posts.filter(post => post.id !== postId)
      this.posts = updatedPosts
      this.postsUpdated.next([...this.posts]);
    })
  }
}
