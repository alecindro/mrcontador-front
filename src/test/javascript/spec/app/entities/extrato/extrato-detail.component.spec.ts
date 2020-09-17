import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ExtratoDetailComponent } from 'app/entities/extrato/extrato-detail.component';
import { Extrato } from 'app/shared/model/extrato.model';

describe('Component Tests', () => {
  describe('Extrato Management Detail Component', () => {
    let comp: ExtratoDetailComponent;
    let fixture: ComponentFixture<ExtratoDetailComponent>;
    const route = ({ data: of({ extrato: new Extrato(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ExtratoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ExtratoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ExtratoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load extrato on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.extrato).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
