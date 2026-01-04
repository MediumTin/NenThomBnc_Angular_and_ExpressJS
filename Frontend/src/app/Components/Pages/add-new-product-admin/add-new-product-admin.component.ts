import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { FilteredProductService } from '../../../Services/FilteredService/filtered-product.service';
import { AddNewProduct } from '../../../Common_Configuration/Models/AddNewProduct';
import { Observable } from 'rxjs';
import { UserInformation } from '../../../Common_Configuration/Models/UserInformation';

@Component({
  selector: 'app-add-new-product-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-new-product-admin.component.html',
  styleUrl: './add-new-product-admin.component.css'
})
export class AddNewProductAdminComponent {
  isUserIdentified : UserInformation[] =[];
  constructor(private filteredProduct : FilteredProductService, private router:Router, private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute, private renderer:Renderer2,private identification: IndentificationService ){}
  AddNewProductUser(addnewproductForm: { productname: string; producttype : string, productgroup: string; productbrand: string;productprice: string;productpricerange: string;productcolor: string;productimage: string;productquantity: string;productarea: string }) {
      let ProductToBeAdded = {
            name :addnewproductForm.productname,
            type :addnewproductForm.producttype,
            group : addnewproductForm.productgroup,
            brand :addnewproductForm.productbrand,
            price : addnewproductForm.productprice,
            price_range: addnewproductForm.productpricerange,
            color: addnewproductForm.productcolor,
            image :addnewproductForm.productimage,
            quantity : addnewproductForm.productquantity,
            area : addnewproductForm.productarea
      };
      console.log('Result ProductToBeAdded :',ProductToBeAdded);
      console.log('Result ProductToBeAdded with area :',ProductToBeAdded.area);
      let isProductToBeAdded : Observable<AddNewProduct>;
      isProductToBeAdded = this.candlesService.setAddNewProduct(ProductToBeAdded);
      isProductToBeAdded.subscribe((UserInfo) => {
        console.log("ProductToBeAdded is ", UserInfo);
        if(UserInfo.name != "undefined" && UserInfo.price != "undefined"){
          // In case of successful add new product
          // Redirect the user to the home page
          console.log("Add new product successfully");
          this.router.navigate(['']);
        }
        else {
          // In case of unsuccessful add new product
          // Allert the user
          // this.router.navigate(['']);
          window.alert('Add new product unsuccessfully!');
        } 
      });
    }


}
