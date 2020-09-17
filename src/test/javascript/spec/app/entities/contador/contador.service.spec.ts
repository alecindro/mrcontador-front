import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContadorService } from 'app/entities/contador/contador.service';
import { IContador, Contador } from 'app/shared/model/contador.model';

describe('Service Tests', () => {
  describe('Contador Service', () => {
    let injector: TestBed;
    let service: ContadorService;
    let httpMock: HttpTestingController;
    let elemDefault: IContador;
    let expectedResult: IContador | IContador[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ContadorService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Contador(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Contador', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Contador()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Contador', () => {
        const returnedFromService = Object.assign(
          {
            razao: 'BBBBBB',
            fantasia: 'BBBBBB',
            telefones: 'BBBBBB',
            datasource: 'BBBBBB',
            cnpj: 'BBBBBB',
            cidade: 'BBBBBB',
            estado: 'BBBBBB',
            cep: 'BBBBBB',
            email: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Contador', () => {
        const returnedFromService = Object.assign(
          {
            razao: 'BBBBBB',
            fantasia: 'BBBBBB',
            telefones: 'BBBBBB',
            datasource: 'BBBBBB',
            cnpj: 'BBBBBB',
            cidade: 'BBBBBB',
            estado: 'BBBBBB',
            cep: 'BBBBBB',
            email: 'BBBBBB',
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

      it('should delete a Contador', () => {
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
