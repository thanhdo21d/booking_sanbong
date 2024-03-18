import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPosts } from 'src/app/interfaces/Product';
import { IUserRequest } from 'src/app/interfaces/User';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-cart-gio-hang',
  templateUrl: './cart-gio-hang.component.html',
  styleUrls: ['./cart-gio-hang.component.scss'],
})
export class CartGioHangComponent {
  user!: IUserRequest;

  listUserPosts!: IPosts[];
  cartData!: any[];
  totalCart!: number;
  totalAll = 0;
  ship = 15000;
  orderSuccess = false;

  userInfo = this.formUserInfo.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required]],
  });
  quantityValues: number[] = [];
  constructor(
    private cartService: CartService,
    private Toast: ToastrService,
    private router: Router,
    private formUserInfo: FormBuilder,
    private userService: UserService,
    private orderService: OrderService
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.handleCart();
  }

  handleCart() {
    this.userService.getUser(this.user._id!).subscribe(({ user }) => {
      this.user = user;
      this.userInfo.patchValue({
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
      });
      this.handleTotal();
    });
  }

  handleTotal() {
    const arrayCart = (this.user as any).cart;

    const total = arrayCart.reduce((acc: number, item: any) => {
      const quantity = item.quantity ? item.quantity : 1;
      return acc + +item.price * quantity;
    }, 0);

    this.totalCart = total;
    this.totalAll = this.ship + total;
  }
  get checkUsername() {
    return this.userInfo.get('username') as FormControl;
  }

  get checkEmail() {
    return this.userInfo.get('email') as FormControl;
  }

  get checkAddress() {
    return this.userInfo.get('address') as FormControl;
  }

  get checkPhone() {
    return this.userInfo.get('phone') as FormControl;
  }

  removeItem(id: string) {
    this.cartService
      .deleteItemCart(id, this.user._id ?? '')
      .subscribe((data) => {
        this.Toast.success('Xóa sản phẩm thành công');
        this.userService.getUser(this.user._id!).subscribe(({ user }) => {
          this.user = user;
          const arrayCart = (user as any).cart;
          const total =
            arrayCart.length > 0 &&
            arrayCart.reduce((acc: number, item: any) => acc + +item.price, 0);

          this.totalCart = total ?? 0;
          this.totalAll = 0;
        });
      });
  }
  handleUpdateQuantity(updatedQuantity: number, index: number) {
    const cartList = this.user.cart.findIndex(
      (_: any, i: number) => i === index
    );

    this.user.cart[cartList].quantity = updatedQuantity;
    this.handleTotal();
  }

  handleButtonClick(index: number, action: string) {
    const input = document.getElementById(`form1-${index}`) as HTMLInputElement;

    if (action === 'decrement') {
      input.stepDown();
    } else if (action === 'increment') {
      input.stepUp();
    }

    this.handleUpdateQuantity(input.valueAsNumber, index);
  }

  handleCheckout() {
    const data: any = {
      nameUser: this.userInfo.value.username || '',
      // email: this.userInfo.value.email || '',
      address: this.userInfo.value.address || '',
      phone: this.userInfo.value.phone || '',
    };

    const dataProductCart =
      this.user.cart.length > 0 &&
      this.user.cart.map((item: any) => ({
        product: item._id,
        quantity: item.quantity ? +item.quantity : 1,
        price: item.price,
      }));
    try {
      this.orderService
        .orderBuy(this.user._id ?? '', {
          ...data,
          items: dataProductCart,
          noteShipping: '',
          paymentMethodId: 'cod',
        })
        .subscribe((data) => {
          this.Toast.success('Đặt hàng thành công');
          this.orderSuccess = true;
          this.router.navigate(['/']);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
