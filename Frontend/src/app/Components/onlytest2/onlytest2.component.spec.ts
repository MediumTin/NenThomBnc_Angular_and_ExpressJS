import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Onlytest2Component } from './onlytest2.component';

describe('Onlytest2Component', () => {
  let component: Onlytest2Component;
  let fixture: ComponentFixture<Onlytest2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Onlytest2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Onlytest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
