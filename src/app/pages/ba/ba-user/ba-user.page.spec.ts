import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaUserPage } from './ba-user.page';

describe('BaUserPage', () => {
  let component: BaUserPage;
  let fixture: ComponentFixture<BaUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
