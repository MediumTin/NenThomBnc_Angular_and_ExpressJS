import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProductAdminComponent } from './add-new-product-admin.component';

describe('AddNewProductAdminComponent', () => {
  let component: AddNewProductAdminComponent;
  let fixture: ComponentFixture<AddNewProductAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewProductAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewProductAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
