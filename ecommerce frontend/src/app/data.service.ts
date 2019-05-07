import { Injectable, OnInit } from '@angular/core';
import{NavigationStart, Router} from '@angular/router';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit{
message = '';
messageType = 'danger';

user: any;
cartItems = 0;

  constructor(private router: Router, private restApi: RestApiService) { }

  ngOnInit(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart){
        this.message = ''
      }
    });
  }

  error(message){
    this.message  = message;
    this.messageType = 'danger';
  }

  success(message){
    this.message = message;
    this.messageType = 'success';
  }

  warning(message){
    this.message = message;
    this.messageType = 'warning'
  }

  async getUser(){
    try{
      if(localStorage.getItem('token')){
        const data = await this.restApi.get('http://localhost:3000/api/accounts/profile');
        if(data['user']){
          this.user = data['user'];
        }
      }
    }catch(err){
      this.error(err);
    }
    
  }

  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(item: string) {
    const cart: any = this.getCart();
    if (cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      return false;
    } else {
      cart.push(item);
      this.cartItems++;
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
  }

  removeFromCart(item: string) {
    let cart: any = this.getCart();
    if (cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      cart = cart.filter(data => JSON.stringify(data) !== JSON.stringify(item));
      this.cartItems--;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  clearCart() {
    this.cartItems = 0;
    localStorage.setItem('cart', '[]');
  }



}
