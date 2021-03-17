import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CatalogComponent } from '../catalog/catalog.component';
import { OrdersService } from '../_sevices/orders.service';
import Order from '../_models/order';
import Product from '../_models/product';


/**
 * Created by Drapegnik on 5/16/17.
 */

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
})
export class OrderFormComponent {
  form: FormGroup;
  products: Array<Product>;
  name: AbstractControl;
  email: AbstractControl;
  summaryPrice: number;

  constructor(private fb: FormBuilder,
              private router: Router,
              private ordersService: OrdersService) {
    this.products = CatalogComponent.selectedProducts;
    if (!this.products) {
      this.products = [];
      this.router.navigate(['orders/create']);
    }
    this.form = fb.group({
      'name': ['', Validators.required],
      'email': ['', Validators.required]
    });
    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
  }

  total() {
    let sum = 0;
    this.products.forEach(p => sum += p.price * p.count);
    this.summaryPrice = sum;
    return sum;
  }

  create() {
    const name = this.name.value;
    const email = this.email.value;
    const { summaryPrice, products } = this;

    this.ordersService.create(new Order({ client: { name, email }, summaryPrice, products })).subscribe(
      () => {
        this.router.navigate(['orders']);
      },
      (err) => {
        console.error(`Error: ${err._body}`);
      });
  }
}
