import { AuthService } from 'src/app/services/auth/auth.service';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MenuItems } from 'src/app/interfaces/ISidebarAdmin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss'],
})
export class SidebarAdminComponent {
  urlPath: string = 'dashboard';
  // constructor(private service: AuthService, private direct: Router) {}
  /* router link */
  menuItems: MenuItems[] = [
    {
      routerLink: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      isActive: true,
    },
    {
      routerLink: 'order',
      label: 'Đơn hàng',
      icon: 'fa-solid fa-cart-shopping',
      isActive: false,
    },
    {
      routerLink: 'manager-users',
      label: 'Người dùng',
      icon: 'fas fa-users',
      isActive: false,
    },
    {
      routerLink: 'manager-users',
      label: 'Nhân viên',
      icon: 'fas fa-users',
      isActive: false,
    },
    {
      routerLink: 'manager-users',
      label: 'manager owner',
      icon: 'fas fa-users',
      isActive: false,
    },
    {
      routerLink: 'manager-users',
      label: 'manager',
      icon: 'fas fa-users',
      isActive: false,
    },
    {
      routerLink: 'manager-product',
      label: 'Sân bóng',
      icon: 'fa-solid fa-file',
      isActive: false,
    },
    {
      routerLink: 'manager-categories',
      label: 'Danh mục',
      icon: 'fa-solid fa-list',
      isActive: false,
    },

    {
      routerLink: 'trash-can',
      label: 'Trash can',
      icon: 'fa-solid fa-trash',
      isActive: false,
    },
    {
      routerLink: 'analytics',
      label: 'Thống kê',
      icon: '',
      isActive: false,
    },
  ];
  constructor(
    private location: Location,
    private service: AuthService,
    private direct: Router
  ) {
    this.urlPath = this.location.path();
    this.setActiveItemByUrl(this.urlPath);
  }
  /* setActiveItem */
  setActiveItem(item: MenuItems) {
    this.menuItems.forEach((item) => {
      item.isActive = false;
    });
    item.isActive = true;
  }
  /* setActiveItemByUrl */
  setActiveItemByUrl(url: string) {
    this.menuItems.forEach((item) => {
      if (item.routerLink === `/admin/${url}`) {
        item.isActive = true;
      }
    });
  }
  onLogout() {
    this.service.logOut();
    this.direct.navigateByUrl('login-admin');
  }
}
