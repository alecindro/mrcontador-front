import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ParceiroUpdateComponent } from 'app/entities/parceiro/parceiro-update.component';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { Parceiro } from 'app/shared/model/parceiro.model';

describe('Component Tests', () => {
  describe('Parceiro Management Update Component', () => {
    let comp: ParceiroUpdateComponent;
    let fixture: ComponentFixture<ParceiroUpdateComponent>;
    let service: ParceiroService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ParceiroUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ParceiroUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ParceiroUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ParceiroService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Parceiro(123);
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
        const entity = new Parceiro();
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
