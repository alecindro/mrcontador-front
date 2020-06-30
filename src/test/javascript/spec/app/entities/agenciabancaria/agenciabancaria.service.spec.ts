import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgenciabancariaService } from 'app/entities/agenciabancaria/agenciabancaria.service';
import { IAgenciabancaria, Agenciabancaria } from 'app/shared/model/agenciabancaria.model';

describe('Service Tests', () => {
  describe('Agenciabancaria Service', () => {
    let injector: TestBed;
    let service: AgenciabancariaService;
    let httpMock: HttpTestingController;
    let elemDefault: IAgenciabancaria;
    let expectedResult: IAgenciabancaria | IAgenciabancaria[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(AgenciabancariaService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Agenciabancaria(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', false);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Agenciabancaria', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Agenciabancaria()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Agenciabancaria', () => {
        const returnedFromService = Object.assign(
          {
            age_numero: 'BBBBBB',
            age_digito: 'BBBBBB',
            age_agencia: 'BBBBBB',
            age_descricao: 'BBBBBB',
            age_situacao: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Agenciabancaria', () => {
        const returnedFromService = Object.assign(
          {
            age_numero: 'BBBBBB',
            age_digito: 'BBBBBB',
            age_agencia: 'BBBBBB',
            age_descricao: 'BBBBBB',
            age_situacao: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Agenciabancaria', () => {
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
