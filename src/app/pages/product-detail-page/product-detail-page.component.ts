import { ActivatedRoute, Router } from '@angular/router';
import { IResViewComment } from 'src/app/interfaces/comment';

import { Component } from '@angular/core';
import { IPosts } from 'src/app/interfaces/Product';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductsService } from 'src/app/services/products/products.service';

import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environment';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss'],
})
export class ProductsDetailPageComponent {
  mailUser!: string | null;
  post!: IPosts;
  relatedPosts!: IPosts[];
  comments!: IResViewComment[];
  urlImage: string = environment.API_URL + '/root/';

  idPost!: string;
  getField!: any;
  bookingForm = this.builder.group({
    fieldId: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    status: ['1', Validators.required],
    description: ['', Validators.required],
  });
  constructor(
    private postService: ProductsService,
    private cateService: CategoryService,
    private router: ActivatedRoute,
    private redirect: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private params: ActivatedRoute
  ) {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');

      this.idPost = id || '';

      if (this.idPost) {
        /* get all comment by id with socket */
        console.log(id);
      }

      this.postService.getPost(id!).subscribe(
        (data) => {
          console.log(data.data, 'db');
          this.post = data.data;
          // this.cateService
          //   .getRelatedPost(data.post.category._id)
          //   .subscribe(({ data }) => {
          //     this.relatedPosts = data.posts!;
          //   });
        },
        () => {
          this.toastr.error("Couldn't find this post.Please try again😥😥");
        }
      );
    });

    const newMailUSer: any = localStorage.getItem('user');
    var nextResult = JSON.parse(newMailUSer);
    this.mailUser = nextResult.email;
    this.handelGetgetField();
  }
  handleSubmitFormBooking() {
    if (this.bookingForm.value.start && this.bookingForm.value.end) {
      // Chuyển đổi giá trị sang đối tượng Date
      const newDataBooking = {
        fieldId: this.params.snapshot.params['id'],
        start: new Date(this.bookingForm.value.start),
        end: new Date(this.bookingForm.value.end),
        status: this.bookingForm.value.status || '1',
        description: this.bookingForm.value.description || '',
      };
      this.postService.createBookingFb(newDataBooking).subscribe(() => {
        this.bookingForm.reset();
        this.toastr.success('Booking thành công');
      });
    } else {
      this.toastr.error('Các trường start và end không được để trống');
    }
  }
  handelGetgetField() {
    this.postService.getAllPosts().subscribe((postsData) => {
      console.log(postsData.data.items, '.posts.docs');
      this.getField = postsData.data.items.slice(0, 4);
      // this.paginationObj.currentPage = postsData.posts.page;
      // this.paginationObj.totalPage = postsData.posts.totalPages;
      // this.paginationObj.totalDocs = postsData.posts.totalDocs;
      // this.paginationObj.limit = postsData.posts.limit;
      // this.paginationObj.hasNextPage = postsData.posts.hasNextPage;
      // this.paginationObj.hasPrevPage = postsData.posts.hasPrevPage;
      // this.paginationObj.totalPagesArray = Array(this.paginationObj.totalPage)
      //   .fill(0)
      //   .map((_, index) => index + 1);
    });
  }
}
