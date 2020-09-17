import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { AtividadeUpdateComponent } from 'app/entities/atividade/atividade-update.component';
import { AtividadeService } from 'app/entities/atividade/atividade.service';
import { Atividade } from 'app/shared/model/atividade.model';

describe('Component Tests', () => {
  describe('Atividade Management Update Component', () => {
    let comp: AtividadeUpdateComponent;
    let fixture: ComponentFixture<AtividadeUpdateComponent>;
    let service: AtividadeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [AtividadeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(AtividadeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AtividadeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AtividadeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Atividade(123);
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
        const entity = new Atividade();
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
