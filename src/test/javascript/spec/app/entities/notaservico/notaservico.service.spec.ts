import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { NotaservicoService } from 'app/entities/notaservico/notaservico.service';
import { INotaservico, Notaservico } from 'app/shared/model/notaservico.model';

describe('Service Tests', () => {
  describe('Notaservico Service', () => {
    let injector: TestBed;
    let service: NotaservicoService;
    let httpMock: HttpTestingController;
    let elemDefault: INotaservico;
    let expectedResult: INotaservico | INotaservico[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(NotaservicoService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Notaservico(0, 0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate, 0, currentDate, 0, 0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            nse_datasaida: currentDate.format(DATE_TIME_FORMAT),
            nse_dataparcela: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Notaservico', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            nse_datasaida: currentDate.format(DATE_TIME_FORMAT),
            nse_dataparcela: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            nse_datasaida: currentDate,
            nse_dataparcela: currentDate,
          },
          returnedFromService
        );

        service.create(new Notaservico()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Notaservico', () => {
        const returnedFromService = Object.assign(
          {
            nse_numero: 1,
            nse_descricao: 'BBBBBB',
            nse_cnpj: 'BBBBBB',
            nse_empresa: 'BBBBBB',
            nse_datasaida: currentDate.format(DATE_TIME_FORMAT),
            nse_valornota: 1,
            nse_dataparcela: currentDate.format(DATE_TIME_FORMAT),
            nse_valorparcela: 1,
            tno_codigo: 1,
            nse_parcela: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            nse_datasaida: currentDate,
            nse_dataparcela: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Notaservico', () => {
        const returnedFromService = Object.assign(
          {
            nse_numero: 1,
            nse_descricao: 'BBBBBB',
            nse_cnpj: 'BBBBBB',
            nse_empresa: 'BBBBBB',
            nse_datasaida: currentDate.format(DATE_TIME_FORMAT),
            nse_valornota: 1,
            nse_dataparcela: currentDate.format(DATE_TIME_FORMAT),
            nse_valorparcela: 1,
            tno_codigo: 1,
            nse_parcela: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            nse_datasaida: currentDate,
            nse_dataparcela: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Notaservico', () => {
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
