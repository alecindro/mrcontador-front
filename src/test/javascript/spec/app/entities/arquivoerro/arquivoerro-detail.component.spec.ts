import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ArquivoerroDetailComponent } from 'app/entities/arquivoerro/arquivoerro-detail.component';
import { Arquivoerro } from 'app/shared/model/arquivoerro.model';

describe('Component Tests', () => {
  describe('Arquivoerro Management Detail Component', () => {
    let comp: ArquivoerroDetailComponent;
    let fixture: ComponentFixture<ArquivoerroDetailComponent>;
    const route = ({ data: of({ arquivoerro: new Arquivoerro(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ArquivoerroDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ArquivoerroDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ArquivoerroDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load arquivoerro on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.arquivoerro).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
