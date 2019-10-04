import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaMapPage } from './ba-map.page';

describe('BaMapPage', () => {
  let component: BaMapPage;
  let fixture: ComponentFixture<BaMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
