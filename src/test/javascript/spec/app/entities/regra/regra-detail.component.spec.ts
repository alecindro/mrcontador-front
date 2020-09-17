import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { RegraDetailComponent } from 'app/entities/regra/regra-detail.component';
import { Regra } from 'app/shared/model/regra.model';

describe('Component Tests', () => {
  describe('Regra Management Detail Component', () => {
    let comp: RegraDetailComponent;
    let fixture: ComponentFixture<RegraDetailComponent>;
    const route = ({ data: of({ regra: new Regra(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [RegraDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(RegraDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RegraDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load regra on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.regra).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
