import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwresetComponent } from './pwreset.component';

describe('PwresetComponent', () => {
  let component: PwresetComponent;
  let fixture: ComponentFixture<PwresetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PwresetComponent]
    });
    fixture = TestBed.createComponent(PwresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
