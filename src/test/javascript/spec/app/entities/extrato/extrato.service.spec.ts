import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ExtratoService } from 'app/entities/extrato/extrato.service';
import { IExtrato, Extrato } from 'app/shared/model/extrato.model';

describe('Service Tests', () => {
  describe('Extrato Service', () => {
    let injector: TestBed;
    let service: ExtratoService;
    let httpMock: HttpTestingController;
    let elemDefault: IExtrato;
    let expectedResult: IExtrato | IExtrato[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ExtratoService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Extrato(0, currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 0, 0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            ext_datalancamento: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Extrato', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            ext_datalancamento: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            ext_datalancamento: currentDate,
          },
          returnedFromService
        );

        service.create(new Extrato()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Extrato', () => {
        const returnedFromService = Object.assign(
          {
            ext_datalancamento: currentDate.format(DATE_TIME_FORMAT),
            ext_historico: 'BBBBBB',
            ext_numerodocumento: 'BBBBBB',
            ext_numerocontrole: 'BBBBBB',
            ext_debito: 1,
            ext_credito: 1,
            ext_descricao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            ext_datalancamento: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Extrato', () => {
        const returnedFromService = Object.assign(
          {
            ext_datalancamento: currentDate.format(DATE_TIME_FORMAT),
            ext_historico: 'BBBBBB',
            ext_numerodocumento: 'BBBBBB',
            ext_numerocontrole: 'BBBBBB',
            ext_debito: 1,
            ext_credito: 1,
            ext_descricao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            ext_datalancamento: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Extrato', () => {
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
