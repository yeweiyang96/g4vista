import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyPageComponent } from './taxonomy-page.component';

describe('TaxonomyPageComponent', () => {
  let component: TaxonomyPageComponent;
  let fixture: ComponentFixture<TaxonomyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxonomyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxonomyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
