import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ParceiroDetailComponent } from 'app/entities/parceiro/parceiro-detail.component';
import { Parceiro } from 'app/shared/model/parceiro.model';

describe('Component Tests', () => {
  describe('Parceiro Management Detail Component', () => {
    let comp: ParceiroDetailComponent;
    let fixture: ComponentFixture<ParceiroDetailComponent>;
    const route = ({ data: of({ parceiro: new Parceiro(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ParceiroDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ParceiroDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ParceiroDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load parceiro on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.parceiro).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
