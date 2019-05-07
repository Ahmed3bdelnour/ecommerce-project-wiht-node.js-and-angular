import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AddressComponent } from './address/address.component';
import { CategoriesComponent } from './categories/categories.component';
import { PostProductComponent } from './post-product/post-product.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {path:'', component: HomeComponent}, 
  {path:'cart', component: CartComponent}, 
  {path:'categories', component: CategoriesComponent},
  {path:'categories/:id', component: CategoryComponent},
  {path:'product/:id', component: ProductComponent},
  {path:'search', component: SearchComponent},
  {path:'register', canActivate: [AuthGuardService], component: RegistrationComponent},
  {path:'login', canActivate: [AuthGuardService], component: LoginComponent},
  {path:'profile', canActivate: [AuthGuardService], component: ProfileComponent},
  {path:'profile/settings', canActivate: [AuthGuardService], component: SettingsComponent},
  {path:'profile/address', canActivate: [AuthGuardService], component: AddressComponent},
  {path:'profile/postproduct', canActivate: [AuthGuardService], component: PostProductComponent},
  {path:'profile/myproducts', canActivate: [AuthGuardService], component: MyProductsComponent},
  {path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
