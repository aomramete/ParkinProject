import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EachreservePage } from './eachreserve.page';

describe('EachreservePage', () => {
  let component: EachreservePage;
  let fixture: ComponentFixture<EachreservePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EachreservePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EachreservePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
