import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clase } from './clase';

describe('Clase', () => {
  let component: Clase;
  let fixture: ComponentFixture<Clase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
