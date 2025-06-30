import { Routes } from '@angular/router';
import { CandlesComponent } from './Components/Pages/candles-component/candles-component.component';
import { HomePageComponent } from './Components/Pages/home-page/home-page.component';
import { LoginAndRegisterComponent } from './Components/Pages/Login_and_Register/login-and-register/login-and-register.component';
import { SessionPageComponent } from './Components/Pages/session-page/session-page.component';
import { OilsComponentComponent } from './Components/Pages/oils-component/oils-component.component';
import { AccessoryComponent } from './Components/Pages/accessory/accessory.component';
import { GiftComponent } from './Components/Pages/gift/gift.component';
import { DiffuseOilsComponent } from './Components/Pages/diffuse-oils/diffuse-oils.component';
import { NaturalOilsComponent } from './Components/Pages/natural-oils/natural-oils.component';
import { BurnCandlesComponent } from './Components/Pages/burn-candles/burn-candles.component';
import { CareCandlesComponent } from './Components/Pages/care-candles/care-candles.component';
import { DetailProductComponent } from './Components/Pages/detail-product/detail-product.component';
import { PaymentPageComponent } from './Components/Pages/payment-page/payment-page.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent }, // get to Home Page 
    {path: 'candles', component: CandlesComponent }, // get all components of candles
    {path: 'candles/search/:searchTerm', component: CandlesComponent }, // get products by search item
    {path: 'candles/tag/:tag', component: CandlesComponent }, // get products by tag
    {path: 'candles/filter/:filter', component: CandlesComponent }, // get products by filter
    {path: 'oils', component: OilsComponentComponent }, // get products by filter
    {path: 'accessory', component: AccessoryComponent }, // get products by filter
    {path: 'gift', component: GiftComponent }, // get products by filter
    {path: 'news', component: HomePageComponent }, // get products by filter
    {path: 'contact', component: HomePageComponent }, // get products by filter
    {path: 'diffuse_oils', component: DiffuseOilsComponent }, // get products by filter
    {path: 'natural_oils', component: NaturalOilsComponent }, // get products by filter
    {path: 'burn_candles', component: BurnCandlesComponent }, // get products by filter
    {path: 'care_candles', component: CareCandlesComponent }, // get products by filter
    {path: 'candle_information/:detail_product', component: DetailProductComponent }, // get products by filter
    {path: 'login_handling', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'login_handling/login', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'login_handling/register', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'get-session', component: SessionPageComponent }, // get session information
    {path: 'get-sid', component: SessionPageComponent }, // get session information
    {path: 'clear-sid', component: SessionPageComponent }, // get session information
    {path: 'destroy-sid', component: SessionPageComponent }, // get session information
    {path: 'destroy-session', component: SessionPageComponent }, // get session information
    {path: 'payment_handling', component: PaymentPageComponent }, // get session information
    // {path:'food/:id', component:FoodPageComponent}, // same as detailed component
    // {path:'cart-page', component: CartPageComponent},
    // {path:'login', component: LoginPageComponent},
    // {path:'register', component: RegisterPageComponent},
    // {path:'checkout', component: CheckoutPageComponent, canActivate:[AuthGuard]},
    // {path:'payment', component: PaymentPageComponent, canActivate:[AuthGuard]},
    // {path:'track/:orderId', component: OrderTrackPageComponent, canActivate:[AuthGuard]},
  ];
