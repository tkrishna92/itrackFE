import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedIssueComponent } from './selected-issue.component';

describe('SelectedIssueComponent', () => {
  let component: SelectedIssueComponent;
  let fixture: ComponentFixture<SelectedIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
