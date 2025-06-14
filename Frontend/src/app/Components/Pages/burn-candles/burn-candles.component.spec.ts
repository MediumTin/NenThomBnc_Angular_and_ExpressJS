import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnCandlesComponent } from './burn-candles.component';

describe('BurnCandlesComponent', () => {
  let component: BurnCandlesComponent;
  let fixture: ComponentFixture<BurnCandlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurnCandlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BurnCandlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
