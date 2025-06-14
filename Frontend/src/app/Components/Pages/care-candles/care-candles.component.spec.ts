import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareCandlesComponent } from './care-candles.component';

describe('CareCandlesComponent', () => {
  let component: CareCandlesComponent;
  let fixture: ComponentFixture<CareCandlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareCandlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareCandlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
