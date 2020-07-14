import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { SocioDetailComponent } from 'app/entities/socio/socio-detail.component';
import { Socio } from 'app/shared/model/socio.model';

describe('Component Tests', () => {
  describe('Socio Management Detail Component', () => {
    let comp: SocioDetailComponent;
    let fixture: ComponentFixture<SocioDetailComponent>;
    const route = ({ data: of({ socio: new Socio(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [SocioDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(SocioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SocioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load socio on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.socio).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
