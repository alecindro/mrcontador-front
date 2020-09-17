import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { NotaservicoUpdateComponent } from 'app/entities/notaservico/notaservico-update.component';
import { NotaservicoService } from 'app/entities/notaservico/notaservico.service';
import { Notaservico } from 'app/shared/model/notaservico.model';

describe('Component Tests', () => {
  describe('Notaservico Management Update Component', () => {
    let comp: NotaservicoUpdateComponent;
    let fixture: ComponentFixture<NotaservicoUpdateComponent>;
    let service: NotaservicoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [NotaservicoUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(NotaservicoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NotaservicoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(NotaservicoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Notaservico(123);
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
        const entity = new Notaservico();
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
