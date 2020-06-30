import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ComprovanteUpdateComponent } from 'app/entities/comprovante/comprovante-update.component';
import { ComprovanteService } from 'app/entities/comprovante/comprovante.service';
import { Comprovante } from 'app/shared/model/comprovante.model';

describe('Component Tests', () => {
  describe('Comprovante Management Update Component', () => {
    let comp: ComprovanteUpdateComponent;
    let fixture: ComponentFixture<ComprovanteUpdateComponent>;
    let service: ComprovanteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ComprovanteUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ComprovanteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ComprovanteUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ComprovanteService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Comprovante(123);
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
        const entity = new Comprovante();
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
