import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListPageComponent } from 'src/app/pages/productsList-page/productsList-page.component';
import { CartGioHangComponent } from 'src/app/pages/cart-gio-hang/cart-gio-hang.component';

import { DonHangComponent } from 'src/app/pages/don-hang/don-hang.component';
import { ProductsDetailPageComponent } from 'src/app/pages/product-detail-page/product-detail-page.component';
import { LayoutClientComponent } from '../../layouts/layout-client/layout-client.component';
import { HomepageComponent } from '../../pages/homepage/homepage.component';
import { UserInfoComponent } from '../../pages/user-info/user-info.component';
import { CartGioHangComponent2 } from 'src/app/components/cart-gio-hang/cart-gio-hang.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutClientComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
      },
      {
        path: 'user-info/:id',
        component: UserInfoComponent,
      },
      {
        path: 'posts/:id',
        component: ProductsDetailPageComponent,
      },
      {
        path: 'cart-gio-hang',
        component: CartGioHangComponent2,
      },
      {
        path: 'blog',
        component: ProductsListPageComponent,
      },
      {
        path: 'cart',
        component: CartGioHangComponent,
      },
      {
        path: 'don-hang',
        component: DonHangComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutClientRoutingModule {}
