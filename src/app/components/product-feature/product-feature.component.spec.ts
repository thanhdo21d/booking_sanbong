import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFeatureComponent } from './product-feature.component';

describe('ProductFeatureComponent', () => {
  let component: ProductFeatureComponent;
  let fixture: ComponentFixture<ProductFeatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductFeatureComponent]
    });
    fixture = TestBed.createComponent(ProductFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
