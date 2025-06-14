import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalOilsComponent } from './natural-oils.component';

describe('NaturalOilsComponent', () => {
  let component: NaturalOilsComponent;
  let fixture: ComponentFixture<NaturalOilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturalOilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalOilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
