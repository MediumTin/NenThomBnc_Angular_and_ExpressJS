import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffuseOilsComponent } from './diffuse-oils.component';

describe('DiffuseOilsComponent', () => {
  let component: DiffuseOilsComponent;
  let fixture: ComponentFixture<DiffuseOilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffuseOilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffuseOilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
