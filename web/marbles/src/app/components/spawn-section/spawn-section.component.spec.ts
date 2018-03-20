import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpawnSectionComponent } from './spawn-section.component';

describe('SpawnSectionComponent', () => {
  let component: SpawnSectionComponent;
  let fixture: ComponentFixture<SpawnSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpawnSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpawnSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
