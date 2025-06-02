import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderReferComponent } from './header-refer.component';

describe('HeaderReferComponent', () => {
  let component: HeaderReferComponent;
  let fixture: ComponentFixture<HeaderReferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderReferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
