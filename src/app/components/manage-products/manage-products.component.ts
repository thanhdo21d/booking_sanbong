import { Component } from '@angular/core';
import { ExcelServiceService } from 'src/app/services/excelService/excel-service.service';
import { IPosts } from 'src/app/interfaces/Product';
import { ProductsService } from 'src/app/services/products/products.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
})
export class ManageProductsComponent {
  paginationObj: any = {
    currentPage: 1,
    totalDocs: 0,
    limt: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };
  title: string = 'Quản lý sản phẩm';
  linkActive: string = '/admin/post-add';
  titleModal: string = 'Thông tin bài post';
  theadTable: string[] = [
    'STT',
    'Tên sản phẩm',
    'Tác giả',
    'Danh mục',
    'Trạng thái',
    'Xét duyệt',
    'Lượt thích',
    'Action',
  ];
  routerLink = '/admin/post-add';
  PostsList: IPosts[] = [];
  Post!: IPosts;
  constructor(
    private postsService: ProductsService,
    private excelServices: ExcelServiceService,
    private toastr: ToastrService
  ) {
    this.getAllPost();
  }

  getAllPost() {
    this.postsService
      .getAllPosts(this.paginationObj.currentPage)
      .subscribe((postsData) => {
        // console.log(postsData.posts.docs);
        this.PostsList = postsData.posts.docs;
        this.paginationObj.currentPage = postsData.posts.page;
        this.paginationObj.totalPage = postsData.posts.totalPages;
        this.paginationObj.totalDocs = postsData.posts.totalDocs;
        this.paginationObj.limit = postsData.posts.limit;
        this.paginationObj.hasNextPage = postsData.posts.hasNextPage;
        this.paginationObj.hasPrevPage = postsData.posts.hasPrevPage;
        this.paginationObj.totalPagesArray = Array(this.paginationObj.totalPage)
          .fill(0)
          .map((_, index) => index + 1);
      });
  }

  // get post by id
  handleGetPost(id: number | string) {
    this.postsService.getPost(id).subscribe(
      (data) => {
        this.Post = data.post;
        // console.log(data);
      },
      () => {
        this.toastr.error('Not found this post!');
      }
    );
  }

  /* handle delete post */
  handleDeletePost(id: string) {
    this.postsService.deleteFakePost(id).subscribe(
      () => {
        this.getAllPost();
      },
      (err) => console.log(err.message)
    );
  }
  /* export to excel */
  exportToExcel() {
    this.excelServices.exportToExcel(this.PostsList, 'Posts');
  }
  gotoPage(page: number | string) {
    this.paginationObj.currentPage = page;
    this.getAllPost();
    // this.getAllPost();
  }
  prevPage(hasPrev: boolean) {
    this.paginationObj.hasPrevPage = hasPrev;
    if (this.paginationObj.hasPrevPage) {
      this.paginationObj.currentPage--;
      this.getAllPost();
    }
  }
  nextPage(hasNext: boolean) {
    this.paginationObj.hasNextPage = hasNext;

    if (this.paginationObj.hasNextPage) {
      this.paginationObj.currentPage++;
      this.getAllPost();
    }
  }
}
