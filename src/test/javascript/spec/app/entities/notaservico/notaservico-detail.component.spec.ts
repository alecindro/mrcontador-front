import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { NotaservicoDetailComponent } from 'app/entities/notaservico/notaservico-detail.component';
import { Notaservico } from 'app/shared/model/notaservico.model';

describe('Component Tests', () => {
  describe('Notaservico Management Detail Component', () => {
    let comp: NotaservicoDetailComponent;
    let fixture: ComponentFixture<NotaservicoDetailComponent>;
    const route = ({ data: of({ notaservico: new Notaservico(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [NotaservicoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(NotaservicoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(NotaservicoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load notaservico on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.notaservico).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
