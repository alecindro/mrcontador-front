import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MrcontadorFrontTestModule } from '../../../test.module';
import { ContadorDetailComponent } from 'app/entities/contador/contador-detail.component';
import { Contador } from 'app/shared/model/contador.model';

describe('Component Tests', () => {
  describe('Contador Management Detail Component', () => {
    let comp: ContadorDetailComponent;
    let fixture: ComponentFixture<ContadorDetailComponent>;
    const route = ({ data: of({ contador: new Contador(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MrcontadorFrontTestModule],
        declarations: [ContadorDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ContadorDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ContadorDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load contador on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.contador).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
