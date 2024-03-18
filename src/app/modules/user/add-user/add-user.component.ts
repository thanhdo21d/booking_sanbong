import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUserRequest } from 'src/app/interfaces/User';
import { UploadImageService } from 'src/app/services/uploadImage/upload-image.service';
import { UserService } from 'src/app/services/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  imagePreview: any;
  userForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', [Validators.required]],
    gender: ['other', [Validators.required]],
    avatar: ['', [Validators.required]],
    cfpassword: ['', [Validators.required]],
  });
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private ImageService: UploadImageService,
    private toastr: ToastrService,
    private redirect: Router
  ) {}

  handleGetFileInput(fileInput: any) {
    const file = fileInput.target.files;
    // console.log(file);
    this.ImageService.uploadImage(file).subscribe(
      (data) => {
        this.userForm.patchValue({
          avatar: data.urls[0].url,
        });
        this.imagePreview = data.urls[0];
        // console.log(this.imagePreview.public_id);

        this.toastr.success('Uploaded avatar');
      },
      () => {
        this.toastr.error('Upload avatar failed');
      }
    );
  }
  handleRemoveImage(public_id: string) {
    this.ImageService.deleteImage(public_id).subscribe(
      () => {
        this.toastr.success('Deleted');
        this.imagePreview = undefined;
      },
      () => {
        this.toastr.error('Delete failed');
      }
    );
  }
  onHandleSubmit() {

    const user: IUserRequest = {
      name: this.userForm.value.username || '',
      password: this.userForm.value.password || '',
      email: this.userForm.value.email || '',
      // role: this.userForm.value.role || '',
      // avatar: this.userForm.value.avatar || '',
      gender: this.userForm.value.gender || '',
      confirmPassword: this.userForm.value.cfpassword || '',
    };
    this.userService.createUser(user).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Create user successful');
        this.redirect.navigate(['admin/manager-users']);
      },
      (err) => {
        console.log(err.message);
        this.toastr.error('Create user failed');
      }
    );
  }
}
