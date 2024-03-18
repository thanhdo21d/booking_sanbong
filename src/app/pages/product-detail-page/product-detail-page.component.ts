import { ActivatedRoute, Router } from '@angular/router';
import { IResViewComment } from 'src/app/interfaces/comment';

import { Component } from '@angular/core';
import { IPosts } from 'src/app/interfaces/Product';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductsService } from 'src/app/services/products/products.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss'],
})
export class ProductsDetailPageComponent {
  post!: IPosts;
  relatedPosts!: IPosts[];
  comments!: IResViewComment[];
  idPost!: string;
  constructor(
    private postService: ProductsService,
    private cateService: CategoryService,
    private router: ActivatedRoute,
    private redirect: Router,
    private toastr: ToastrService
  ) {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');

      this.idPost = id || '';

      if (this.idPost) {
        /* get all comment by id with socket */

        console.log('Ád');
      }

      this.postService.getPost(id!).subscribe(
        (data) => {
          this.post = data.post;

          this.cateService
            .getRelatedPost(data.post.category._id)
            .subscribe(({ data }) => {
              this.relatedPosts = data.posts!;
            });
        },
        () => {
          this.toastr.error("Couldn't find this post.Please try again😥😥");
          // alert("Couldn't find this post.Please try again😥😥");
          this.redirect.navigate(['/']);
        }
      );
    });
  }
}
