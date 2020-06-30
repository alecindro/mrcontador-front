import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ComprovanteDetailComponent } from 'app/entities/comprovante/comprovante-detail.component';
import { Comprovante } from 'app/shared/model/comprovante.model';

describe('Component Tests', () => {
  describe('Comprovante Management Detail Component', () => {
    let comp: ComprovanteDetailComponent;
    let fixture: ComponentFixture<ComprovanteDetailComponent>;
    const route = ({ data: of({ comprovante: new Comprovante(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ComprovanteDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ComprovanteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ComprovanteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load comprovante on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.comprovante).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
