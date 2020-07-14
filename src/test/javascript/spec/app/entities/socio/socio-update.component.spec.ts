import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { SocioUpdateComponent } from 'app/entities/socio/socio-update.component';
import { SocioService } from 'app/entities/socio/socio.service';
import { Socio } from 'app/shared/model/socio.model';

describe('Component Tests', () => {
  describe('Socio Management Update Component', () => {
    let comp: SocioUpdateComponent;
    let fixture: ComponentFixture<SocioUpdateComponent>;
    let service: SocioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [SocioUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(SocioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SocioUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SocioService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Socio(123);
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
        const entity = new Socio();
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
