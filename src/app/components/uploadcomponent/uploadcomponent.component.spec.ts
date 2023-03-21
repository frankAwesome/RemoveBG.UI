import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadcomponentComponent } from './uploadcomponent.component';

describe('UploadcomponentComponent', () => {
  let component: UploadcomponentComponent;
  let fixture: ComponentFixture<UploadcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadcomponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
