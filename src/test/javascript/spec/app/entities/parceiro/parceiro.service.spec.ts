import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { IParceiro, Parceiro } from 'app/shared/model/parceiro.model';

describe('Service Tests', () => {
  describe('Parceiro Service', () => {
    let injector: TestBed;
    let service: ParceiroService;
    let httpMock: HttpTestingController;
    let elemDefault: IParceiro;
    let expectedResult: IParceiro | IParceiro[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ParceiroService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Parceiro(
        0,
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        currentDate,
        0,
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            par_datacadastro: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Parceiro', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            par_datacadastro: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            par_datacadastro: currentDate,
          },
          returnedFromService
        );

        service.create(new Parceiro()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Parceiro', () => {
        const returnedFromService = Object.assign(
          {
            par_descricao: 'BBBBBB',
            par_razaosocial: 'BBBBBB',
            par_tipopessoa: 'BBBBBB',
            par_cnpjcpf: 'BBBBBB',
            par_rgie: 'BBBBBB',
            par_obs: 'BBBBBB',
            par_datacadastro: currentDate.format(DATE_TIME_FORMAT),
            spa_codigo: 1,
            logradouro: 'BBBBBB',
            cep: 'BBBBBB',
            cidade: 'BBBBBB',
            estado: 'BBBBBB',
            area_atuacao: 'BBBBBB',
            comercio: true,
            nfc_e: true,
            danfe: true,
            servico: true,
            nfs_e: true,
            transportadora: true,
            conhec_transporte: true,
            industria: true,
            ct: true,
            outras: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            par_datacadastro: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Parceiro', () => {
        const returnedFromService = Object.assign(
          {
            par_descricao: 'BBBBBB',
            par_razaosocial: 'BBBBBB',
            par_tipopessoa: 'BBBBBB',
            par_cnpjcpf: 'BBBBBB',
            par_rgie: 'BBBBBB',
            par_obs: 'BBBBBB',
            par_datacadastro: currentDate.format(DATE_TIME_FORMAT),
            spa_codigo: 1,
            logradouro: 'BBBBBB',
            cep: 'BBBBBB',
            cidade: 'BBBBBB',
            estado: 'BBBBBB',
            area_atuacao: 'BBBBBB',
            comercio: true,
            nfc_e: true,
            danfe: true,
            servico: true,
            nfs_e: true,
            transportadora: true,
            conhec_transporte: true,
            industria: true,
            ct: true,
            outras: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            par_datacadastro: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Parceiro', () => {
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
