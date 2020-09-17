import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ContadorUpdateComponent } from 'app/entities/contador/contador-update.component';
import { ContadorService } from 'app/entities/contador/contador.service';
import { Contador } from 'app/shared/model/contador.model';

describe('Component Tests', () => {
  describe('Contador Management Update Component', () => {
    let comp: ContadorUpdateComponent;
    let fixture: ComponentFixture<ContadorUpdateComponent>;
    let service: ContadorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ContadorUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ContadorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContadorUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ContadorService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Contador(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Contador();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
