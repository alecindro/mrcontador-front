import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ArquivoerroUpdateComponent } from 'app/entities/arquivoerro/arquivoerro-update.component';
import { ArquivoerroService } from 'app/entities/arquivoerro/arquivoerro.service';
import { Arquivoerro } from 'app/shared/model/arquivoerro.model';

describe('Component Tests', () => {
  describe('Arquivoerro Management Update Component', () => {
    let comp: ArquivoerroUpdateComponent;
    let fixture: ComponentFixture<ArquivoerroUpdateComponent>;
    let service: ArquivoerroService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ArquivoerroUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ArquivoerroUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArquivoerroUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ArquivoerroService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Arquivoerro(123);
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
        const entity = new Arquivoerro();
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
