import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDriversComponent } from './individual-drivers.component';

describe('IndividualDriversComponent', () => {
  let component: IndividualDriversComponent;
  let fixture: ComponentFixture<IndividualDriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
