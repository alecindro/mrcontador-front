import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { BancoUpdateComponent } from 'app/entities/banco/banco-update.component';
import { BancoService } from 'app/entities/banco/banco.service';
import { Banco } from 'app/shared/model/banco.model';

describe('Component Tests', () => {
  describe('Banco Management Update Component', () => {
    let comp: BancoUpdateComponent;
    let fixture: ComponentFixture<BancoUpdateComponent>;
    let service: BancoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [BancoUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(BancoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BancoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BancoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Banco(123);
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
        const entity = new Banco();
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
