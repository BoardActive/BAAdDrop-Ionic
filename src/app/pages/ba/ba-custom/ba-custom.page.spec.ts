import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BaCustomPage } from './ba-custom.page';

describe('BaCustomPage', () => {
  let component: BaCustomPage;
  let fixture: ComponentFixture<BaCustomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaCustomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BaCustomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
