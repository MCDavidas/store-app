/**
 * Created by Drapegnik on 5/15/17.
 */

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operator/map';
import 'rxjs/add/operator/catch';

import SettingsService from '../settings.servise';
import Order from '../_models/order';
import Product from '../_models/product';

@Injectable()
export class OrdersService {

  constructor(private http: Http) {
  };

  getAll() {
    return this.http.get(`${SettingsService.apiUrl}/orders`)
      .map((response: Response) => {
        if (response.status === 200) {
          const body = JSON.parse(response['_body']);
          return body.map((order) => {
            order.products = order.products.map(o => new Product(o));
            return new Order(order);
          });
        }

        return response;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  create(order: Order) {
    const { client, products, summaryPrice } = order;
    const items = products.map(({ id, count }) => ({ product: id, count }));

    return this.http.post(`${SettingsService.apiUrl}/orders`, { client, items, summaryPrice })
      .map((response: Response) => {
        console.log(response);
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
