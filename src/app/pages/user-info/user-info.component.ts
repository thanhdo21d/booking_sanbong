import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IUser, IUserRequest } from 'src/app/interfaces/User';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IPosts } from 'src/app/interfaces/Product';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  user!: IUserRequest;
  userLocal: IUser = JSON.parse(
    localStorage.getItem(this.auth.TOKEN_USER) || '{}'
  );
  listUserPosts!: IPosts[];
  userInfo = this.formUserInfo.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],

    address: [''],
    phone: [''],
  });

  constructor(
    private profile: UserService,
    private auth: AuthService,
    private formUserInfo: FormBuilder,
    private router: ActivatedRoute,
    private userService: UserService
  ) {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.userService.getUser(id!).subscribe(({ user }) => {
        this.user = user;
        this.userInfo.patchValue({
          username: user.username,
          email: user.email,
          address: user.address,
          phone: user.phone,
        });
      });
      this.profile.getUserPosts(id!).subscribe(
        ({ data }) => {
          if (data.postList) {
            this.listUserPosts = data.postList;
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    });
  }

  get checkUsername() {
    return this.userInfo.get('username') as FormControl;
  }

  get checkEmail() {
    return this.userInfo.get('email') as FormControl;
  }

  get checkAddress() {
    return this.userInfo.get('address') as FormControl;
  }

  get checkPhone() {
    return this.userInfo.get('phone') as FormControl;
  }

  onEdit() {
    const editProfile: IUserRequest = {
      username: this.userInfo.value.username || '',
      email: this.userInfo.value.email || '',
      address: this.userInfo.value.address || '',
      phone: this.userInfo.value.phone || '',
    };

    this.profile.updateUser(this.user._id, editProfile).subscribe((data) => {
      localStorage.setItem(this.auth.TOKEN_USER, JSON.stringify(data.user));
    });
  }
}
