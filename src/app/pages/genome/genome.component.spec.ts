import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenomeComponent } from './genome.component';

describe('GenomeComponent', () => {
  let component: GenomeComponent;
  let fixture: ComponentFixture<GenomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
