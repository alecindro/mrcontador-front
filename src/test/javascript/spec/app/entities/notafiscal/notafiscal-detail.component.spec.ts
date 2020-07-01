import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { NotafiscalDetailComponent } from 'app/entities/notafiscal/notafiscal-detail.component';
import { Notafiscal } from 'app/shared/model/notafiscal.model';

describe('Component Tests', () => {
  describe('Notafiscal Management Detail Component', () => {
    let comp: NotafiscalDetailComponent;
    let fixture: ComponentFixture<NotafiscalDetailComponent>;
    const route = ({ data: of({ notafiscal: new Notafiscal(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [NotafiscalDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(NotafiscalDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(NotafiscalDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load notafiscal on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.notafiscal).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
