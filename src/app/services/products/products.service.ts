import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDocPosts, IPostAnalytics, IPosts } from 'src/app/interfaces/Product';

import { IUser } from 'src/app/interfaces/User';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { baseURL } from 'src/app/utils/instance';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseURL: string = '';
  constructor(private http: HttpClient, private router: Router) {
    this.baseURL = `${baseURL}`;
  }
  getAccessToken() {
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || '');

    if (!accessToken || accessToken === '') {
      this.router.navigate(['/login-admin']);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const options = { headers: headers };
    return options;
  }
  getAllPosts(): Observable<any> {
    return this.http.post<any>(
      `https://db83-222-252-24-198.ngrok-free.app/api/Field/GetData`,
      {}
    );
  }
  getPostsApporved(data: any): Observable<any> {
    return this.http.post<any>(
      `https://db83-222-252-24-198.ngrok-free.app/api/Field/GetData`,
      {}
    );
  }
  getPost(id: number | string): Observable<any> {
    return this.http.get<any>(
      `https://db83-222-252-24-198.ngrok-free.app/api/Field/GetField/${id}`
    );
  }
  deleteFakePost(id: number | string) {
    return this.http.put(`${baseURL}/posts/delete-fake/${id}`, {
      deleted: true,
    });
  }
  createPost(post: any): Observable<any> {
    // const options = this.getAccessToken();
    return this.http.post(
      `https://db83-222-252-24-198.ngrok-free.app/api/Field/Create`,
      post
    );
  }

  updatePost(post: any, id: string): Observable<any> {
    // const options = this.getAccessToken();
    return this.http.put(`${baseURL}/posts/${id}`, post);
  }

  /* get post by id */
  getPostById(id: string): Observable<any> {
    return this.http.get<any>(
      // `https://db83-222-252-24-198.ngrok-free.app/api/Field/GetField/${id}`
      `https://db83-222-252-24-198.ngrok-free.app/api/Field/GetField/197bdd2e-823b-47b5-e895-08dc4308236a`
    );
  }

  /* get posts by id user */
  getPostByIdUser(id: string): Observable<{ message: string; data: IUser }> {
    return this.http.get<{ message: string; data: IUser }>(
      `${this.baseURL}/users/posts/all/${id}`
    );
  }

  /*Search posts by title */
  searchPost(keyword: string): Observable<IDocPosts> {
    return this.http.get<IDocPosts>(`${baseURL}/posts/approved?q=${keyword}`);
  }
  /* get post with delete: true */
  getPostDeleted(): Observable<IDocPosts> {
    return this.http.get<IDocPosts>(
      `${baseURL}/posts/deleted/all?_limit=10&_page=1`
    );
  }
  /* undo delete post */
  undoDeletePost(id: string): Observable<IPosts> {
    return this.http.put<IPosts>(`${this.baseURL}/posts/restore/${id}`, {});
  }
  /* delete post */
  deletePost(id: string): Observable<IPosts> {
    return this.http.delete<IPosts>(`${this.baseURL}/posts/${id}`);
  }
  /* lấy số liệu người dùng được tạo ra trong 1 ngày/ 1 tuần */
  getPostByDate(): Observable<IPostAnalytics[]> {
    return this.http.get<IPostAnalytics[]>(
      `${this.baseURL}/posts/counter/post-new`
    );
  }
  /* lấy ra các bài viết trạng thái pending */
  getPostPending(): Observable<IDocPosts> {
    return this.http.get<IDocPosts>(`${this.baseURL}/posts/pending/all`);
  }
  /* update status approved */
  updateApprovedPost(id: string): Observable<IPosts> {
    return this.http.put<IPosts>(`${this.baseURL}/posts/approved/${id}`, {});
  }
  /* update status pending */
  updatePendingPost(id: string): Observable<IPosts> {
    return this.http.put<IPosts>(`${this.baseURL}/posts/pending/${id}`, {});
  }

  /* filter price */
  filterPrice(
    min: number,
    max: number
  ): Observable<{ message: string; posts: IPosts[] }> {
    return this.http.get<{ message: string; posts: IPosts[] }>(
      `${this.baseURL}/posts/filter/price?min=${min}&max=${max}`
    );
  }
  createBookingFb(post: any) {
    return this.http.post(
      `https://db83-222-252-24-198.ngrok-free.app/api/Booking/Create
      `,
      post
    );
  }
}
