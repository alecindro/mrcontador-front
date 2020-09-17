import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ArquivoService } from 'app/entities/arquivo/arquivo.service';
import { IArquivo, Arquivo } from 'app/shared/model/arquivo.model';

describe('Service Tests', () => {
  describe('Arquivo Service', () => {
    let injector: TestBed;
    let service: ArquivoService;
    let httpMock: HttpTestingController;
    let elemDefault: IArquivo;
    let expectedResult: IArquivo | IArquivo[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ArquivoService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Arquivo(0, 'AAAAAAA', 'AAAAAAA', currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 0, 'AAAAAAA', 'AAAAAAA');
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

      it('should create a Arquivo', () => {
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

        service.create(new Arquivo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Arquivo', () => {
        const returnedFromService = Object.assign(
          {
            nome: 'BBBBBB',
            nomeOriginal: 'BBBBBB',
            dataCadastro: currentDate.format(DATE_TIME_FORMAT),
            tipoArquivo: 'BBBBBB',
            tipoDoc: 'BBBBBB',
            s3Url: 'BBBBBB',
            s3Dir: 'BBBBBB',
            tamanho: 1,
            etag: 'BBBBBB',
            usuario: 'BBBBBB',
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

      it('should return a list of Arquivo', () => {
        const returnedFromService = Object.assign(
          {
            nome: 'BBBBBB',
            nomeOriginal: 'BBBBBB',
            dataCadastro: currentDate.format(DATE_TIME_FORMAT),
            tipoArquivo: 'BBBBBB',
            tipoDoc: 'BBBBBB',
            s3Url: 'BBBBBB',
            s3Dir: 'BBBBBB',
            tamanho: 1,
            etag: 'BBBBBB',
            usuario: 'BBBBBB',
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

      it('should delete a Arquivo', () => {
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
