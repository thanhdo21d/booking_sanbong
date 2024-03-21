import { IUserRegister, IUserResponse } from 'src/app/interfaces/User';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from './../../utils/instance';

interface ILogin {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  TOKEN_KEY = 'accessToken';
  TOKEN_USER = 'user';
  constructor(private http: HttpClient) {}
  /* login */
  loginUser(userInfo: ILogin): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(
      `https://db83-222-252-24-198.ngrok-free.app/api/Account/login`,
      userInfo
    );
  }
  //https://db83-222-252-24-198.ngrok-free.app/api/Account/login

  // registerUser(user: IUser): Observable<IUserResponse> {
  //   return this.http.post<IUserResponse>(`${baseURL}/sign-up`, user);
  // }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_USER);
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem(this.TOKEN_KEY)!) as string;
  }

  getUserLogin() {
    return JSON.parse(localStorage.getItem(this.TOKEN_USER)!);
  }

  isAuthenticated(): boolean {
    return this.getToken() ? true : false;
  }

  hasPermission(role: string) {
    const user = JSON.parse(localStorage.getItem(this.TOKEN_USER)!);
    return role == user.role ? true : false;
  }
  /* signup */
  signUpUser(userInfo: IUserRegister): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(
      `https://db83-222-252-24-198.ngrok-free.app/api/Account/Register`,
      userInfo
    );
  }
}
