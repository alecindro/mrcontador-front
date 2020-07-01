import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ExtratoUpdateComponent } from 'app/entities/extrato/extrato-update.component';
import { ExtratoService } from 'app/entities/extrato/extrato.service';
import { Extrato } from 'app/shared/model/extrato.model';

describe('Component Tests', () => {
  describe('Extrato Management Update Component', () => {
    let comp: ExtratoUpdateComponent;
    let fixture: ComponentFixture<ExtratoUpdateComponent>;
    let service: ExtratoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ExtratoUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ExtratoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExtratoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ExtratoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Extrato(123);
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
        const entity = new Extrato();
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
