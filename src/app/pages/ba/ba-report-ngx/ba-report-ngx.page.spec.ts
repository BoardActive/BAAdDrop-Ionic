import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaReportNgxPage } from './ba-report-ngx.page';

describe('BaReportNgxPage', () => {
  let component: BaReportNgxPage;
  let fixture: ComponentFixture<BaReportNgxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaReportNgxPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaReportNgxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
