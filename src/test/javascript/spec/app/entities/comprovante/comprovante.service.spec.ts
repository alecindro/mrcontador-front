import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ComprovanteService } from 'app/entities/comprovante/comprovante.service';
import { IComprovante, Comprovante } from 'app/shared/model/comprovante.model';

describe('Service Tests', () => {
  describe('Comprovante Service', () => {
    let injector: TestBed;
    let service: ComprovanteService;
    let httpMock: HttpTestingController;
    let elemDefault: IComprovante;
    let expectedResult: IComprovante | IComprovante[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ComprovanteService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Comprovante(0, 0, 0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate, currentDate, 0, 0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            com_datavencimento: currentDate.format(DATE_TIME_FORMAT),
            com_datapagamento: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Comprovante', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            com_datavencimento: currentDate.format(DATE_TIME_FORMAT),
            com_datapagamento: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            com_datavencimento: currentDate,
            com_datapagamento: currentDate,
          },
          returnedFromService
        );

        service.create(new Comprovante()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Comprovante', () => {
        const returnedFromService = Object.assign(
          {
            par_codigo: 1,
            age_codigo: 1,
            com_cnpj: 'BBBBBB',
            com_beneficiario: 'BBBBBB',
            com_documento: 'BBBBBB',
            com_datavencimento: currentDate.format(DATE_TIME_FORMAT),
            com_datapagamento: currentDate.format(DATE_TIME_FORMAT),
            com_valordocumento: 1,
            com_valorpagamento: 1,
            com_observacao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            com_datavencimento: currentDate,
            com_datapagamento: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Comprovante', () => {
        const returnedFromService = Object.assign(
          {
            par_codigo: 1,
            age_codigo: 1,
            com_cnpj: 'BBBBBB',
            com_beneficiario: 'BBBBBB',
            com_documento: 'BBBBBB',
            com_datavencimento: currentDate.format(DATE_TIME_FORMAT),
            com_datapagamento: currentDate.format(DATE_TIME_FORMAT),
            com_valordocumento: 1,
            com_valorpagamento: 1,
            com_observacao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            com_datavencimento: currentDate,
            com_datapagamento: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Comprovante', () => {
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
