import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { InteligentService } from 'app/entities/inteligent/inteligent.service';
import { IInteligent, Inteligent } from 'app/shared/model/inteligent.model';

describe('Service Tests', () => {
  describe('Inteligent Service', () => {
    let injector: TestBed;
    let service: InteligentService;
    let httpMock: HttpTestingController;
    let elemDefault: IInteligent;
    let expectedResult: IInteligent | IInteligent[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(InteligentService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Inteligent(
        0,
        'AAAAAAA',
        'AAAAAAA',
        currentDate,
        false,
        'AAAAAAA',
        0,
        0,
        currentDate,
        currentDate,
        'AAAAAAA',
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            datalancamento: currentDate.format(DATE_TIME_FORMAT),
            datainicio: currentDate.format(DATE_TIME_FORMAT),
            datafim: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should return a list of Inteligent', () => {
        const returnedFromService = Object.assign(
          {
            historico: 'BBBBBB',
            historicofinal: 'BBBBBB',
            datalancamento: currentDate.format(DATE_TIME_FORMAT),
            associado: true,
            periodo: 'BBBBBB',
            debito: 1,
            credito: 1,
            datainicio: currentDate.format(DATE_TIME_FORMAT),
            datafim: currentDate.format(DATE_TIME_FORMAT),
            cnpj: 'BBBBBB',
            beneficiario: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            datalancamento: currentDate,
            datainicio: currentDate,
            datafim: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
