import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaReportsPage } from './ba-reports.page';

describe('BaReportsPage', () => {
  let component: BaReportsPage;
  let fixture: ComponentFixture<BaReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaReportsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
