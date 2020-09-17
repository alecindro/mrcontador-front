import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { AgenciabancariaUpdateComponent } from 'app/entities/agenciabancaria/agenciabancaria-update.component';
import { AgenciabancariaService } from 'app/entities/agenciabancaria/agenciabancaria.service';
import { Agenciabancaria } from 'app/shared/model/agenciabancaria.model';

describe('Component Tests', () => {
  describe('Agenciabancaria Management Update Component', () => {
    let comp: AgenciabancariaUpdateComponent;
    let fixture: ComponentFixture<AgenciabancariaUpdateComponent>;
    let service: AgenciabancariaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [AgenciabancariaUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(AgenciabancariaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AgenciabancariaUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AgenciabancariaService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Agenciabancaria(123);
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
        const entity = new Agenciabancaria();
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
