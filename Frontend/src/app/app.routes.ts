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
import { ShoppingBagComponent } from './Components/Pages/shopping-bag/shopping-bag.component';
import { OnlytestComponent } from './Components/onlytest/onlytest.component';
import { Onlytest2Component } from './Components/onlytest2/onlytest2.component';
import { NewComponent } from './Components/new/new.component';
import { ContactComponent } from './Components/contact/contact.component';
import { CommonProductComponent } from './Components/common-product/common-product.component';
import { TESTComponent } from './Components/test/test.component';
import { environment } from '../environments/environment';
import { AnotherInformationComponent } from './Components/Pages/another-information/another-information.component';
import { AddNewProductAdminComponent } from './Components/Pages/add-new-product-admin/add-new-product-admin.component';

export const routes: Routes = [
  // All below routing only used in Angular internal navigation
    {path: '', component: HomePageComponent }, // get to Home Page 
    (environment.common_concept)?{path: 'candle', component: CommonProductComponent }:{path: 'candle', component: CandlesComponent }, // get all components of candles
    {path: 'candles/search/:searchTerm', component: CandlesComponent }, // get products by search item
    {path: 'candles/tag/:tag', component: CandlesComponent }, // get products by tag
    {path: 'candles/filter/:filter', component: CandlesComponent }, // get products by filter
    (environment.common_concept)?{path: 'oil', component: CommonProductComponent }:{path: 'oil', component: OilsComponentComponent }, // get products by filter
    (environment.common_concept)?{path: 'accessory', component: CommonProductComponent }:{path: 'accessory', component: AccessoryComponent }, // get products by filter
    (environment.common_concept)?{path: 'gift', component: CommonProductComponent }:{path: 'gift', component: GiftComponent }, // get products by filter
    {path: 'news', component: NewComponent }, // get products by filter
    {path: 'contact', component: ContactComponent }, // get products by filter
    (environment.common_concept)?{path: 'diffuse_oils', component: CommonProductComponent }:{path: 'diffuse_oils', component: DiffuseOilsComponent }, // get products by filter
    (environment.common_concept)?{path: 'natural_oils', component: CommonProductComponent }:{path: 'natural_oils', component: NaturalOilsComponent }, // get products by filter
    (environment.common_concept)?{path: 'burn_candles', component: CommonProductComponent }:{path: 'burn_candles', component: BurnCandlesComponent }, // get products by filter
    (environment.common_concept)?{path: 'care_candles', component: CommonProductComponent }:{path: 'care_candles', component: CareCandlesComponent }, // get products by filter
    {path: 'candle_information/:detail_product', component: DetailProductComponent }, // get products by filter
    {path: 'login_handling', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'login_handling/login', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'login_handling/register', component: LoginAndRegisterComponent }, // get products by tag
    {path: 'another_information/delivery_policy', component: AnotherInformationComponent }, // get session information
    {path: 'another_information/payment_policy', component: AnotherInformationComponent }, // get session information
    {path: 'another_information/return_policy', component: AnotherInformationComponent }, // get session information
    {path: 'another_information/privacy_policy', component: AnotherInformationComponent }, // get session information
    {path: 'payment_handling', component: PaymentPageComponent }, // get session information - NEED TO AUTHENTICATE
    {path: 'Shopping_Bag_handling', component: ShoppingBagComponent }, // get session information - NEED TO AUTHENTICATE
    {path: 'add_new_product', component: AddNewProductAdminComponent } // get session information - NEED TO AUTHORIZE
    // {path: 'get-session', component: SessionPageComponent }, // get session information
    // {path: 'get-sid', component: SessionPageComponent }, // get session information
    // {path: 'clear-sid', component: SessionPageComponent }, // get session information
    // {path: 'destroy-sid', component: SessionPageComponent }, // get session information
    // {path: 'destroy-session', component: SessionPageComponent }, // get session information
  ];
// SHOPPING_BAG_HANDLING_URL