import { Component } from '@angular/core';
import { IOrder } from 'src/app/interfaces/order.interface';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/user.service';
import { formatCurrency } from 'src/app/utils/format-currency';
import { handleFomatDate } from 'src/app/utils/fomatDate';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent {
  title: string = 'Quản lý đơn hàng';

  displayedColumns: string[] = [
    'STT',
    'items',
    'inforOrderShipping',
    'status',
    'total',
    'createdAt',
  ];
  dataSourcePending: IOrder[] = [];
  dataSourceDone: IOrder[] = [];
  dataSourceCancel: IOrder[] = [];

  theadTable: string[] = ['STT', 'Tên sản phẩm', 'Số lương', 'Trạng thái'];
  orders: IOrder[] = [];
  orderDones: IOrder[] = [];
  orderCancel: IOrder[] = [];
  orderPending: IOrder[] = [];

  constructor(
    private userService: UserService,
    private orderServer: OrderService,
    private toastr: ToastrService
  ) {
    this.getAllOrder();
  }

  /* get All users */
  getAllOrder() {
    this.orderServer.getAllOrder().subscribe((order) => {
      this.orders = order;
      this.orderDones = this.orders.filter((order) => order.status === 'done');
      this.orderCancel = this.orders.filter(
        (order) => order.status === 'canceled'
      );
      this.orderPending = this.orders.filter(
        (order) => order.status === 'pending'
      );
      this.dataSourcePending = this.orderPending;
      this.dataSourceDone = this.orderDones;
      this.dataSourceCancel = this.orderCancel;
    });
  }

  /* format currentcy */
  formatCurrency(value: number) {
    return formatCurrency(value);
  }

  /* format date */
  formatDate(date: string) {
    return handleFomatDate(date);
  }

  /* handle change status */
  handleChangeStatus(id: string, status: string) {
    this.orderServer.updateOrder(id, status).subscribe((data) => {
      console.log(
        '🚀 ~ ManageOrderComponent ~ this.orderServer.updateOrder ~ data:',
        data
      );
      this.toastr.success('Cập nhật trạng thái đơn hàng thành công');
      this.getAllOrder();
    });
  }

  /* handle confirm order done */
  handleConfirmOrderDone(id: string) {
    this.handleChangeStatus(id, 'done');
  }

  /* handle confirm order cancel */
  handleConfirmOrderCancel(id: string) {
    this.handleChangeStatus(id, 'canceled');
  }
}
