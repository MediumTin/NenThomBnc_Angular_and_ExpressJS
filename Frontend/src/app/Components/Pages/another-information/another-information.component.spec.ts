import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherInformationComponent } from './another-information.component';

describe('AnotherInformationComponent', () => {
  let component: AnotherInformationComponent;
  let fixture: ComponentFixture<AnotherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnotherInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnotherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
