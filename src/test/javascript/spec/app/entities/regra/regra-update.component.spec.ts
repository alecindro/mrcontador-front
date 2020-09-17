import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { RegraUpdateComponent } from 'app/entities/regra/regra-update.component';
import { RegraService } from 'app/entities/regra/regra.service';
import { Regra } from 'app/shared/model/regra.model';

describe('Component Tests', () => {
  describe('Regra Management Update Component', () => {
    let comp: RegraUpdateComponent;
    let fixture: ComponentFixture<RegraUpdateComponent>;
    let service: RegraService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [RegraUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(RegraUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RegraUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RegraService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Regra(123);
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
        const entity = new Regra();
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
