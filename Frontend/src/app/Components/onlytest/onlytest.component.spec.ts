import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlytestComponent } from './onlytest.component';

describe('OnlytestComponent', () => {
  let component: OnlytestComponent;
  let fixture: ComponentFixture<OnlytestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlytestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlytestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
