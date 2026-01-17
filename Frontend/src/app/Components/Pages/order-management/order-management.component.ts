import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AdminManagementService } from '../../../Services/AdminManagement/admin-management.service';
import { Customer } from '../../../Common_Configuration/Models/Customer';
import { Coupon } from '../../../Common_Configuration/Models/Coupon';
import { Inventory } from '../../../Common_Configuration/Models/Inventory';
import { Warehouse } from '../../../Common_Configuration/Models/Warehouse';
import { Order_status } from '../../../Common_Configuration/Models/Order_status';

@Component({
  selector: 'app-order-management',
  imports: [CommonModule,FormsModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent {
  constructor(private admin_management_service : AdminManagementService) {
    this.handleCustomer();
  }
  // Xuất dữ liệu ra CSV
  exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) return;
    const replacer = (key: string, value: any) => value === null || value === undefined ? '' : value;
    const header = Object.keys(data[0]);
    const csv = [
      header.join(','),
      ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  exportOrders() {
    // Export tất cả nội dung của order và order detail
    const rows: any[] = [];
    this.orders.forEach(order => {
      if (order.details && order.details.length) {
        order.details.forEach(detail => {
          rows.push({
            OrderId: order.OrderId,
            CustomerId: order.CustomerId,
            CustomerUsername: order.CustomerUsername,
            TotalAmount: order.TotalAmount,
            OrderStatus: order.OrderStatus,
            // Thông tin chi tiết
            OrderDetailId: detail.OrderDetailId,
            ProductName: detail.ProductName,
            Quantity: detail.Quantity,
            UnitPrice: detail.UnitPrice,
            SubTotalAmount: detail.SubTotalAmount,
            PaymentId: detail.PaymentId,
            PaymentMethod: detail.PaymentMethod,
            PaymentGatewayId: detail.PaymentGatewayId,
            PaymentStatus: detail.PaymentStatus
          });
        });
      } else {
        // Nếu không có detail, vẫn export thông tin order
        rows.push({
          OrderId: order.OrderId,
          CustomerId: order.CustomerId,
          CustomerUsername: order.CustomerUsername,
          TotalAmount: order.TotalAmount,
          OrderStatus: order.OrderStatus
        });
      }
    });
    this.exportToCSV(rows, 'orders.csv');
  }
  exportWarehouses() {
    this.exportToCSV(this.warehouses, 'warehouses.csv');
  }
  exportInventories() {
    this.exportToCSV(this.inventories, 'inventories.csv');
  }
  exportCoupons() {
    this.exportToCSV(this.coupons, 'coupons.csv');
  }
  exportCustomers() {
    this.exportToCSV(this.customers, 'customers.csv');
  }
  selectedSection: string = 'Customer';
  pendingSection: string | null = null;
  showConfirmPopup: boolean = false;
  Coupon_changed: boolean = false;
  Order_changed: boolean = false;
  Coupon_changed_list: Coupon[] = [];
  Order_changed_list: Order_status[] = [];

  sections = [
    { key: 'Customer', label: 'Customer' },
    { key: 'Coupon', label: 'Coupon' },
    { key: 'Inventory', label: 'Inventory' },
    { key: 'WareHouse', label: 'WareHouse' },
    { key: 'OrderStatus', label: 'Order Status' }
  ];

  selectSection(section: string) {
    if (this.Coupon_changed || this.Order_changed) {
      this.pendingSection = section;
      this.showConfirmPopup = true;
    } else {
      this.selectedSection = section;
      switch (section) {
        case 'Customer':
          this.handleCustomer();
          break;
        case 'Coupon':
          this.handleCoupon();
          break;
        case 'Inventory':
          this.handleInventory();
          break;
        case 'WareHouse':
          this.handleWareHouse();
          break;
        case 'OrderStatus':
          this.handleOrderStatus();
          break;
      }
    }
  }

  onEdit_for_Coupon(coupon: any) {
    this.Coupon_changed = true;
    console.log('Edited coupon:', coupon);
    console.log('New Coupon_id value:', coupon.Coupon_id);
    for(let i=0; i<this.Coupon_changed_list.length; i++){
      if(this.Coupon_changed_list[i].Coupon_id === coupon.Coupon_id){
        this.Coupon_changed_list[i].StatusActivation = coupon.StatusActivation
        console.log(this.Coupon_changed_list);
        return;
      }
    }
    this.Coupon_changed_list.push(coupon);
    console.log(this.Coupon_changed_list);
  }

  onEdit_for_Order_status(order: any) {
    this.Order_changed = true;
    console.log('Edited order:', order);
    console.log('New Order_id value:', order.OrderId);
    for(let i=0; i<this.Order_changed_list.length; i++){
      if(this.Order_changed_list[i].OrderId === order.OrderId){
        this.Order_changed_list[i].OrderStatus = order.OrderStatus
        console.log(this.Order_changed_list);
        return;
      }
    }
    this.Order_changed_list.push(order);
    console.log(this.Order_changed_list);

  }

  confirmIgnoreChanges() {
    
    this.showConfirmPopup = false;
    if (this.pendingSection) {
      this.selectedSection = this.pendingSection;
      this.pendingSection = null;
    }
    this.Coupon_changed = false;
    this.Order_changed = false;
    this.Coupon_changed_list = [];
    this.Order_changed_list = [];
  }

  confirmSaveChanges() {
    // TODO: Thực hiện lưu thay đổi thực tế ở đây nếu cần

    this.showConfirmPopup = false;
    if (this.pendingSection) {
      this.selectedSection = this.pendingSection;
      this.pendingSection = null;
    }
    if(this.Coupon_changed){
          this.admin_management_service.UpdateCouponStatusActivation(this.Coupon_changed_list).subscribe(data => {
        console.log('Coupons updated successfully:', data);
      }); 
      this.Coupon_changed_list = [];
    };
    if(this.Order_changed){
          this.admin_management_service.UpdateAllOrderStatus(this.Order_changed_list).subscribe(data => {
        console.log('Orders updated successfully:', data);
      }); 
      this.Order_changed_list = [];
    }

    this.Coupon_changed = false;
    this.Order_changed = false;
  }

  // Dummy data cho customer
  // customers = [
  //   {
  //     Customer_Id: 'C001',
  //     name: 'Nguyen Van A',
  //     email: 'nguyenvana@example.com',
  //     address: '123 Đường ABC, Quận 1, TP.HCM'
  //   },
  //   {
  //     Customer_Id: 'C002',
  //     name: 'Tran Thi B',
  //     email: 'tranthib@example.com',
  //     address: '456 Đường XYZ, Quận 3, TP.HCM'
  //   }
  // ];
  customers : Customer[] = [];

  handleCustomer() {
    // Sau này sẽ gọi API lấy dữ liệu customer
    // Hiện tại dùng dữ liệu mẫu
    this.admin_management_service.getAllCustomer().subscribe(data => {
      this.customers = data;
    });
    return this.customers;
  }

  // Dummy data cho coupon
  // coupons = [
  //   {
  //     Coupon_id: 'CP001',
  //     Code: 'NEWYEAR2026',
  //     Discount_type: 'Percent',
  //     Discount_value: 20,
  //     MinOrderValue: 500000,
  //     MaxDiscountValue: 100000,
  //     ValidFrom: '2026-01-01',
  //     ValidTo: '2026-01-31',
  //     UsageLimit: 100,
  //     LimitForPerson: 2,
  //     StatusActivation: true
  //   },
  //   {
  //     Coupon_id: 'CP002',
  //     Code: 'FREESHIP',
  //     Discount_type: 'Fixed',
  //     Discount_value: 50000,
  //     MinOrderValue: 300000,
  //     MaxDiscountValue: 50000,
  //     ValidFrom: '2026-01-01',
  //     ValidTo: '2026-02-15',
  //     UsageLimit: 50,
  //     LimitForPerson: 1,
  //     StatusActivation: false
  //   }
  // ];
  coupons: Coupon[] = [];

  handleCoupon() {
    // Sau này sẽ gọi API lấy dữ liệu coupon
    // Hiện tại dùng dữ liệu mẫu
    this.admin_management_service.getAllCoupon().subscribe(data => {
      this.coupons = data;
    });
    return this.coupons;
  }

  // Dummy data cho inventory
  // inventories = [
  //   {
  //     InventoryId: 'INV001',
  //     ProductName: 'Nến thơm Lavender',
  //     Quantity: 120,
  //     WarehouseName: 'Kho A',
  //     Location: 'Quận 7, TP.HCM'
  //   },
  //   {
  //     InventoryId: 'INV002',
  //     ProductName: 'Nến thơm Rose',
  //     Quantity: 80,
  //     WarehouseName: 'Kho B',
  //     Location: 'Quận 2, TP.HCM'
  //   }
  // ];
  inventories: Inventory[] = [];

  handleInventory() {
    // Sau này sẽ gọi API lấy dữ liệu inventory
    // Hiện tại dùng dữ liệu mẫu
    this.admin_management_service.getAllInventory().subscribe(data => {
      this.inventories = data;
    });
    return this.inventories;
  }

  // Dummy data cho warehouse
  // warehouses = [
  //   {
  //     Warehouse_ID: 'WH001',
  //     WarehouseName: 'Kho A',
  //     Location: 'Quận 7, TP.HCM',
  //     Capacity: 1000,
  //     ManagerName: 'Nguyen Van Quan'
  //   },
  //   {
  //     Warehouse_ID: 'WH002',
  //     WarehouseName: 'Kho B',
  //     Location: 'Quận 2, TP.HCM',
  //     Capacity: 800,
  //     ManagerName: 'Tran Thi Dieu'
  //   }
  // ];
  warehouses: Warehouse[] = [];

  handleWareHouse() {
    // Sau này sẽ gọi API lấy dữ liệu warehouse
    // Hiện tại dùng dữ liệu mẫu
    this.admin_management_service.getAllWarehouse().subscribe(data => {
      this.warehouses = data;
    });
    return this.warehouses;
  }

  // Dummy data cho order
  // orders = [
  //   {
  //     OrderId: 'ORD001',
  //     CustomerId: 'C001',
  //     CustomerUsername: 'nguyenvana',
  //     TotalAmount: 650000,
  //     OrderStatus: 'Completed',
  //     details: [
  //       {
  //         OrderDetailId: 'OD001',
  //         ProductName: 'Nến thơm Lavender',
  //         Quantity: 2,
  //         UnitPrice: 200000,
  //         SubTotalAmount: 400000,
  //         PaymentId: 'PMT001',
  //         PaymentMethod: 'Credit Card',
  //         PaymentGatewayId: 'GW001',
  //         PaymentStatus: 'Paid'
  //       },
  //       {
  //         OrderDetailId: 'OD002',
  //         ProductName: 'Nến thơm Rose',
  //         Quantity: 1,
  //         UnitPrice: 250000,
  //         SubTotalAmount: 250000,
  //         PaymentId: 'PMT001',
  //         PaymentMethod: 'Credit Card',
  //         PaymentGatewayId: 'GW001',
  //         PaymentStatus: 'Paid'
  //       }
  //     ]
  //   },
  //   {
  //     OrderId: 'ORD002',
  //     CustomerId: 'C002',
  //     CustomerUsername: 'tranthib',
  //     TotalAmount: 300000,
  //     OrderStatus: 'Pending',
  //     details: [
  //       {
  //         OrderDetailId: 'OD003',
  //         ProductName: 'Nến thơm Jasmine',
  //         Quantity: 1,
  //         UnitPrice: 300000,
  //         SubTotalAmount: 300000,
  //         PaymentId: 'PMT002',
  //         PaymentMethod: 'Bank Transfer',
  //         PaymentGatewayId: 'GW002',
  //         PaymentStatus: 'Pending'
  //       }
  //     ]
  //   }
  // ];
  orders: Order_status[] = [];

  selectedOrder: any = null;

  handleOrderStatus() {
    // Sau này sẽ gọi API lấy dữ liệu order
    // Hiện tại dùng dữ liệu mẫu
    this.admin_management_service.getAllOrderStatus().subscribe(data => {
      this.orders = data;
    });
    return this.orders;
  }

  selectOrder(order: any) {
    this.selectedOrder = order;
  }

  closeOrderDetail() {
    this.selectedOrder = null;
  }
}
