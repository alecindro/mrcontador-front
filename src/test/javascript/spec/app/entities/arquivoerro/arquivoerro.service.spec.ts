import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ArquivoerroService } from 'app/entities/arquivoerro/arquivoerro.service';
import { IArquivoerro, Arquivoerro } from 'app/shared/model/arquivoerro.model';

describe('Service Tests', () => {
  describe('Arquivoerro Service', () => {
    let injector: TestBed;
    let service: ArquivoerroService;
    let httpMock: HttpTestingController;
    let elemDefault: IArquivoerro;
    let expectedResult: IArquivoerro | IArquivoerro[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ArquivoerroService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Arquivoerro(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate, 'AAAAAAA', 'AAAAAAA', 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dataCadastro: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Arquivoerro', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dataCadastro: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataCadastro: currentDate,
          },
          returnedFromService
        );

        service.create(new Arquivoerro()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Arquivoerro', () => {
        const returnedFromService = Object.assign(
          {
            nome: 'BBBBBB',
            nomeOriginal: 'BBBBBB',
            tipoArquivo: 'BBBBBB',
            s3Url: 'BBBBBB',
            s3Dir: 'BBBBBB',
            dataCadastro: currentDate.format(DATE_TIME_FORMAT),
            usuario: 'BBBBBB',
            contador: 'BBBBBB',
            tamanho: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataCadastro: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Arquivoerro', () => {
        const returnedFromService = Object.assign(
          {
            nome: 'BBBBBB',
            nomeOriginal: 'BBBBBB',
            tipoArquivo: 'BBBBBB',
            s3Url: 'BBBBBB',
            s3Dir: 'BBBBBB',
            dataCadastro: currentDate.format(DATE_TIME_FORMAT),
            usuario: 'BBBBBB',
            contador: 'BBBBBB',
            tamanho: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataCadastro: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Arquivoerro', () => {
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
