import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { NotafiscalUpdateComponent } from 'app/entities/notafiscal/notafiscal-update.component';
import { NotafiscalService } from 'app/entities/notafiscal/notafiscal.service';
import { Notafiscal } from 'app/shared/model/notafiscal.model';

describe('Component Tests', () => {
  describe('Notafiscal Management Update Component', () => {
    let comp: NotafiscalUpdateComponent;
    let fixture: ComponentFixture<NotafiscalUpdateComponent>;
    let service: NotafiscalService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [NotafiscalUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(NotafiscalUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NotafiscalUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(NotafiscalService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Notafiscal(123);
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
        const entity = new Notafiscal();
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
