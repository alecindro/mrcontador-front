import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { AgenciabancariaDetailComponent } from 'app/entities/agenciabancaria/agenciabancaria-detail.component';
import { Agenciabancaria } from 'app/shared/model/agenciabancaria.model';

describe('Component Tests', () => {
  describe('Agenciabancaria Management Detail Component', () => {
    let comp: AgenciabancariaDetailComponent;
    let fixture: ComponentFixture<AgenciabancariaDetailComponent>;
    const route = ({ data: of({ agenciabancaria: new Agenciabancaria(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [AgenciabancariaDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(AgenciabancariaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AgenciabancariaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load agenciabancaria on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.agenciabancaria).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
