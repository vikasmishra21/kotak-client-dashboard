import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryResolutionComponent } from './query-resolution.component';

describe('QueryResolutionComponent', () => {
  let component: QueryResolutionComponent;
  let fixture: ComponentFixture<QueryResolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryResolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
