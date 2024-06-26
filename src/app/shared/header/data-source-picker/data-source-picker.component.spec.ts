import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourcePickerComponent } from './data-source-picker.component';

describe('DataSourcePickerComponent', () => {
  let component: DataSourcePickerComponent;
  let fixture: ComponentFixture<DataSourcePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSourcePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
