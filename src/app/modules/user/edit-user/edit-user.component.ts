import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/users/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser, IUserRequest } from 'src/app/interfaces/User';
import { UploadImageService } from 'src/app/services/uploadImage/upload-image.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  user!: IUser;
  imagePreview: any;
  userForm = this.fb.group({
    username: ['', [Validators.required]],
    // password: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', [Validators.required]],
    avatar: ['', [Validators.required]],
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private redirect: Router,
    private toastr: ToastrService,
    private ImageService: UploadImageService
  ) {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.userService.getUser(id!).subscribe(({ user: userResponse }) => {
        this.user = userResponse;

        // this.imagePreview = userResponse.avatar;
        this.userForm.patchValue({
          username: userResponse.username,
          email: userResponse.email,
          role: userResponse.role,
          avatar: userResponse.avatar,
        });
      });
    });
  }

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
        this.toastr.error('Upload avatar faile');
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
    // console.log(this.userForm.value);
    // return;

    if (this.userForm.invalid) return;
    const user: IUserRequest = {
      username: this.userForm.value.username || '',
      email: this.userForm.value.email || '',
      // password: this.userForm.value.password || '',
      role: this.userForm.value.role || 'user',
      avatar: this.userForm.value.avatar || '',
    };
    this.userService.updateUser(this.user._id!, user).subscribe(
      () => {
        this.toastr.success('Update successful');
        this.redirect.navigate(['admin/manager-users']);

        // return;
      },
      () => {
        this.toastr.error('Update failed');
      }
    );
  }
}
