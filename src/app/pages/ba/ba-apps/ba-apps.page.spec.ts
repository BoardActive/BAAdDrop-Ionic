import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaAppsPage } from './ba-apps.page';

describe('BaAppsPage', () => {
  let component: BaAppsPage;
  let fixture: ComponentFixture<BaAppsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaAppsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaAppsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
