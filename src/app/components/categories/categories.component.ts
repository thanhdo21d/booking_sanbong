import { CategoryService } from './../../services/category/category.service';
import { Component } from '@angular/core';
import { ExcelServiceService } from './../../services/excelService/excel-service.service';
import { ICategory } from 'src/app/interfaces/Category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  title: string = 'Quản lý các danh mục';
  routerLink: string = '/admin/add-category';
  theadTable: string[] = ['STT', 'Tên danh mục', 'Slug', 'Action'];
  categories: ICategory[] = [];
  constructor(
    private categoryService: CategoryService,
    private excelServiceService: ExcelServiceService
  ) {
    this.getAllCategories();
  }
  /* get all categories */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((categoriesData) => {
      this.categories = categoriesData.data;
    });
  }
  /* handle edit category */
  handleEditCategory(items: any) {
    console.log(
      '🚀 ~ file: categories.component.ts:14 ~ CategoriesComponent ~ handleEditCategory ~ items:',
      items
    );
  }
  /* handle delete user */
  handleDeleteCategory(id: string) {
    this.categoryService
      .deleteCategory(id)
      .subscribe(() => this.getAllCategories());
  }
  /* export to excel */
  exportToExcel() {
    this.excelServiceService.exportToExcel(this.categories, 'categories');
  }
}
