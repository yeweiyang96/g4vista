import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenomePageComponent } from './genome-page.component';

describe('GenomePageComponent', () => {
  let component: GenomePageComponent;
  let fixture: ComponentFixture<GenomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
