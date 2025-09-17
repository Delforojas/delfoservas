import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tipoclase } from './tipoclase';

describe('Tipoclase', () => {
  let component: Tipoclase;
  let fixture: ComponentFixture<Tipoclase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tipoclase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tipoclase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
