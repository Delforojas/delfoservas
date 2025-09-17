import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bonos } from './bonos';

describe('Bonos', () => {
  let component: Bonos;
  let fixture: ComponentFixture<Bonos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bonos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bonos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
