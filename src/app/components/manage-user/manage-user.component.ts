import { FormBuilder, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { IUser } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/users/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent {
  paginationObj: any = {
    currentPage: 1,
    totalDocs: 0,
    limt: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };
  title: string = 'Quản lý người dùng';
  titleModal: string = 'Thêm người dùng';
  linkActive: string = '/admin/add-user';
  theadTable: string[] = [
    'STT',
    'Tên',
    'Email',
    'Quyền',
    'Trạng thái',
    'Action',
  ];
  usersList: IUser[] = [];
  userForm = this.builder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    is_active: ['', [Validators.required]],
    avatar: ['', [Validators.required]],
  });
  constructor(
    private userService: UserService,
    private builder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.getAllUsers();
  }
  /* handle delete user */
  handleDeleteUser(id: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user._id === id) {
      this.toastr.warning('Không thể tự xóa chính mình.');
      return;
    }
    this.userService.deleteUserFake(id).subscribe(() => {
      this.toastr.success('Xóa thành công.');
      this.getAllUsers();
    });
  }
  /* get All users */
  getAllUsers() {
    this.userService
      .getAllUsers(this.paginationObj.currentPage)
      .subscribe((users) => {
        // console.log(users);
        this.usersList = users.docs;

        this.paginationObj.currentPage = users.page;
        this.paginationObj.totalPage = users.totalPages;
        this.paginationObj.totalDocs = users.totalDocs;
        this.paginationObj.limit = users.limit;
        this.paginationObj.hasNextPage = users.hasNextPage;
        this.paginationObj.hasPrevPage = users.hasPrevPage;
        this.paginationObj.totalPagesArray = Array(this.paginationObj.totalPage)
          .fill(0)
          .map((_, index) => index + 1);
      });
  }
  /* handle add new user */
  handleAddNewUser() {
    console.log(this.userForm.value);
  }
  gotoPage(page: number | string) {
    this.paginationObj.currentPage = page;
    this.getAllUsers();
    // this.getAllPost();
  }

  prevPage(hasPrev: boolean) {
    this.paginationObj.hasPrevPage = hasPrev;
    if (this.paginationObj.hasPrevPage) {
      this.paginationObj.currentPage--;
      this.getAllUsers();
    }
  }

  nextPage(hasNext: boolean) {
    this.paginationObj.hasNextPage = hasNext;

    if (this.paginationObj.hasNextPage) {
      this.paginationObj.currentPage++;
      this.getAllUsers();
    }
  }
}
