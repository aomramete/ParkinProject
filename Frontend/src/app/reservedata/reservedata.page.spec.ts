import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReservedataPage } from './reservedata.page';

describe('ReservedataPage', () => {
  let component: ReservedataPage;
  let fixture: ComponentFixture<ReservedataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservedataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservedataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
