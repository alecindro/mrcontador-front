import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { NotafiscalService } from 'app/entities/notafiscal/notafiscal.service';
import { INotafiscal, Notafiscal } from 'app/shared/model/notafiscal.model';

describe('Service Tests', () => {
  describe('Notafiscal Service', () => {
    let injector: TestBed;
    let service: NotafiscalService;
    let httpMock: HttpTestingController;
    let elemDefault: INotafiscal;
    let expectedResult: INotafiscal | INotafiscal[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(NotafiscalService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Notafiscal(0, 0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate, 0, currentDate, 0, 0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            not_datasaida: currentDate.format(DATE_TIME_FORMAT),
            not_dataparcela: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Notafiscal', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            not_datasaida: currentDate.format(DATE_TIME_FORMAT),
            not_dataparcela: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            not_datasaida: currentDate,
            not_dataparcela: currentDate,
          },
          returnedFromService
        );

        service.create(new Notafiscal()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Notafiscal', () => {
        const returnedFromService = Object.assign(
          {
            not_numero: 1,
            not_descricao: 'BBBBBB',
            not_cnpj: 'BBBBBB',
            not_empresa: 'BBBBBB',
            not_datasaida: currentDate.format(DATE_TIME_FORMAT),
            not_valornota: 1,
            not_dataparcela: currentDate.format(DATE_TIME_FORMAT),
            not_valorparcela: 1,
            tno_codigo: 1,
            not_parcela: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            not_datasaida: currentDate,
            not_dataparcela: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Notafiscal', () => {
        const returnedFromService = Object.assign(
          {
            not_numero: 1,
            not_descricao: 'BBBBBB',
            not_cnpj: 'BBBBBB',
            not_empresa: 'BBBBBB',
            not_datasaida: currentDate.format(DATE_TIME_FORMAT),
            not_valornota: 1,
            not_dataparcela: currentDate.format(DATE_TIME_FORMAT),
            not_valorparcela: 1,
            tno_codigo: 1,
            not_parcela: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            not_datasaida: currentDate,
            not_dataparcela: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Notafiscal', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
