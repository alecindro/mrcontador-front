import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { InteligentDetailComponent } from 'app/entities/inteligent/inteligent-detail.component';
import { Inteligent } from 'app/shared/model/inteligent.model';

describe('Component Tests', () => {
  describe('Inteligent Management Detail Component', () => {
    let comp: InteligentDetailComponent;
    let fixture: ComponentFixture<InteligentDetailComponent>;
    const route = ({ data: of({ inteligent: new Inteligent(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [InteligentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(InteligentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(InteligentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load inteligent on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.inteligent).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
