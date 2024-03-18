import { AfterViewInit, Component, ElementRef } from '@angular/core';

import { IPosts } from 'src/app/interfaces/Product';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent {
  featureLists: IPosts[] = [];
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  constructor(private postsService: ProductsService) {
    this.getAllPosts();
  }
  /* get all posts */
  getAllPosts() {
    this.postsService.getPostsApporved('').subscribe((res) => {
      console.log(res.data.items,'fwqd');
      this.featureLists = res.data.items.slice(0,5);
    });
  }
  handleFomatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript tính từ 0 - 11, nên cần cộng 1
    const year = date.getFullYear();
    // Định dạng lại chuỗi ngày, tháng, năm
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
}
