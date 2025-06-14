import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilsComponentComponent } from './oils-component.component';

describe('OilsComponentComponent', () => {
  let component: OilsComponentComponent;
  let fixture: ComponentFixture<OilsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OilsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
