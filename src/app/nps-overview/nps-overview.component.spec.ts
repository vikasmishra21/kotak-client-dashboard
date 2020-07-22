import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsOverviewComponent } from './nps-overview.component';

describe('NpsOverviewComponent', () => {
  let component: NpsOverviewComponent;
  let fixture: ComponentFixture<NpsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
