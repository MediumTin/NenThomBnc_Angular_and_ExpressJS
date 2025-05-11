import { Routes } from '@angular/router';
import { CandlesComponent } from './Pages/candles-component/candles-component.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { LoginAndRegisterComponent } from './Pages/Login_and_Register/login-and-register/login-and-register.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent }, // get to Home Page 
    {path: 'candles', component: CandlesComponent }, // get all components of candles
    {path: 'candles/search/:searchTerm', component: CandlesComponent }, // get products by search item
    {path: 'candles/tag/:tag', component: CandlesComponent }, // get products by tag
    {path: 'login_handling', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'login_handling/login', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'login_handling/register', component: LoginAndRegisterComponent }, // get products by tag
    // {path:'food/:id', component:FoodPageComponent}, // same as detailed component
    // {path:'cart-page', component: CartPageComponent},
    // {path:'login', component: LoginPageComponent},
    // {path:'register', component: RegisterPageComponent},
    // {path:'checkout', component: CheckoutPageComponent, canActivate:[AuthGuard]},
    // {path:'payment', component: PaymentPageComponent, canActivate:[AuthGuard]},
    // {path:'track/:orderId', component: OrderTrackPageComponent, canActivate:[AuthGuard]},
  ];
