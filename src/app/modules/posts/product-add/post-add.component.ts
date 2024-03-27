import { FormBuilder, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from 'src/app/interfaces/Category';
import { ImagePreview } from 'src/app/interfaces/Image';
import { MyUploadAdapter } from '../myuploadAdapter';
import { CategoryService } from '../../../services/category/category.service';
import { ProductsService } from '../../../services/products/products.service';
import { UploadImageService } from '../../../services/uploadImage/upload-image.service';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.scss'],
})
export class PostAddComponent {
  postForm = this.builder.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    content: ['', [Validators.required]],
    images: [[''], [Validators.required]],
    address: ['', [Validators.required]],
    author: [''],
    category: ['', [Validators.required]],
    is_active: ['public', [Validators.required]],
    status: ['pending', [Validators.required]],
    price: [0, [Validators.required]],
  });
  categories: any[] = [];
  public Editor = ClassicEditor;
  public editorContent = '';
  imagePreviews: ImagePreview[] = [];
  nextImageId = 0;
  urls: any[] = [];
  constructor(
    private postsService: ProductsService,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private uploadImageService: UploadImageService,
    private http: HttpClient,
    private categoryService: CategoryService
  ) {
    this.getAllCategories();
  }
  /* get data */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories.data;
    });
  }

  handleFileInput(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.urls.push(files[i]);
    }
  }
  handleRemoveImage(public_id: string) {
    if (!public_id) return;
    this.uploadImageService.deleteImage(public_id).subscribe(() => {
      this.imagePreviews = this.imagePreviews.filter(
        (image) => image.public_id !== public_id
      );
    });
  }
  handleSubmitPostForm() {
    /* lấy ra thông tin người dùng */
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user) {
      this.toastr.error('Bạn chưa đăng nhập');
      return;
    }
    /* lấy ra thông tin   */
    const userId = user._id;
    const post = {
      Name: this.postForm.value.title,
      Description: this.postForm.value.content,
      // category: this.postForm.value.category,
      images: this.urls[0],
      Address: this.postForm.value.address,
      // is_active:
      //   this.postForm.value.is_active === '' ||
      //   this.postForm.value.is_active === 'public'
      //     ? true
      //     : false,
      // status: this.postForm.value.status,
      price: this.postForm.value.price,
    };
    const postData = new FormData();
    if (this.postForm.value.title) {
      postData.append('Name', this.postForm.value.title);
    }
    if (this.postForm.value.content) {
      postData.append('Description', this.postForm.value.content);
    }
    if (this.postForm.value.address) {
      postData.append('Address', this.postForm.value.address);
    }
    if (this.postForm.value.price) {
      postData.append('price', this.postForm.value.price.toString());
    }
    if (this.postForm.value.category) {
      postData.append('FieldAreaId', this.postForm.value.category.toString());
    }
    for (const image of this.urls) {
      postData.append('picture', image);
    }
    this.postsService.createPost(postData).subscribe(
      () => {
        this.toastr.success('Thêm Sân bóng thành công');
        this.router.navigate(['/admin/manager-product']);
        this.postForm.reset();
      },
      () => {
        this.toastr.error('Thêm sản phẩm thất bại');
      }
    );
  }

  onEditorReady = (editor: any) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: any
    ) => {
      return new MyUploadAdapter(loader, this.http);
    };
  };
}
