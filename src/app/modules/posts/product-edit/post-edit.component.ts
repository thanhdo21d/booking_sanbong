import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from 'src/app/interfaces/Category';
import { ImagePreview } from 'src/app/interfaces/Image';
import { IPosts } from 'src/app/interfaces/Product';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { UploadImageService } from 'src/app/services/uploadImage/upload-image.service';
import { MyUploadAdapter } from '../myuploadAdapter';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
})
export class PostEditComponent implements AfterViewInit {
  tempFile: any;

  EditForm = this.builder.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    content: ['', [Validators.required]],

    images: [[''], [Validators.required]],
    author: [''],
    category: ['', [Validators.required]],
    is_active: [''],
    status: ['peding', [Validators.required]],
    price: [0, [Validators.required]],
  });
  categories: ICategory[] = [];
  public Editor = ClassicEditor;
  public ContentPost!: IPosts;
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
    private categoryService: CategoryService,

    private params: ActivatedRoute
  ) {
    this.getAllCategories();
  }

  ngAfterViewInit(): void {
    const id = this.params.snapshot.params['id'];
    this.postsService.getPostById(id).subscribe((data) => {
      this.ContentPost = data.post;
      this.imagePreviews = data.post.images;
      this.tempFile = data.post.images;

      this.EditForm.patchValue({
        title: data.post.title,
        content: data.post.content,
        price: +data.post.price,
        category: data.post.category._id,
        is_active: data.post.is_active ? 'public' : 'private',
        status: data.post.status,
        author: data.post.author._id,
      });
    });
  }

  /* get data */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories.data;
    });
  }

  handleFileInput(event: any): void {
    const files = event.target.files;
    /* update image to nodejs */
    this.uploadImageService.uploadImage(files).subscribe(
      (res) => {
        this.urls = res.urls;
        this.imagePreviews = res.urls; /* preview image */
      },
      () => {
        this.toastr.error('Tải hình ảnh lên thất bại');
      }
    );
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
    const id = this.params.snapshot.params['id'];
    if (this.EditForm.invalid) return;
    /* lấy ra thông tin người dùng */
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user) {
      this.toastr.error('Bạn chưa đăng nhập');
      return;
    }
    /* lấy ra thông tin người dùng */
    // const userId = user._id;
    const post = {
      title: this.EditForm.value.title,
      content: this.EditForm.value.content,
      category: this.EditForm.value.category,
      images: this.urls.length <= 0 ? this.tempFile : this.urls,
      author: this.EditForm.value.author,
      is_active: this.EditForm.value.is_active === 'public' ? true : false,
      status: this.EditForm.value.status,
      price: this.EditForm.value.price,
    };

    // console.log(post);

    this.postsService.updatePost(post, id).subscribe(
      () => {
        this.toastr.success('Chỉnh sửa thành công');
        this.router.navigate(['/admin/manager-product']);
        this.EditForm.reset();
      },
      () => {
        this.toastr.error('Chỉnh sửa thất bại');
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
