import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaMessagesPage } from './ba-messages.page';

describe('BaMessagesPage', () => {
  let component: BaMessagesPage;
  let fixture: ComponentFixture<BaMessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaMessagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
