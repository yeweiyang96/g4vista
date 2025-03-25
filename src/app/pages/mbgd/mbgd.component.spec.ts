import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbgdComponent } from './mbgd.component';

describe('MbgdComponent', () => {
  let component: MbgdComponent;
  let fixture: ComponentFixture<MbgdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbgdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbgdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
