import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from '../../shared/constants/input.constants';

import { IParceiro, Parceiro } from '../../shared/model/parceiro.model';
import { ParceiroService } from './parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViaCepService } from '../../shared/services/viacepservice';
import { CnpjService } from '../../shared/services/cnpjservice';
import { CnpjModel } from '../../shared/services/cnpjmodel';

@Component({
  selector: 'jhi-parceiro-update',
  templateUrl: './parceiro-update.component.html',
})
export class ParceiroUpdateComponent implements OnInit {
  isSaving = false;

  maskJuridica = '00.000.000/0000-00';
  maskFisica = '000.000.000-00';
  mask = this.maskJuridica;
  _false = false;
  _true = true;
  juridica = 'J';
  fisica = 'F';

  editForm = this.fb.group({
    id: [],
    parDescricao: [null, [Validators.maxLength(50)]],
    parRazaosocial: [null, [Validators.maxLength(70), Validators.required]],
    parTipopessoa: [null, [Validators.maxLength(1)]],
    parCnpjcpf: [null, [Validators.maxLength(20), Validators.required]],
    parRgie: [null, [Validators.maxLength(20)]],
    parObs: [null, [Validators.maxLength(200)]],
    parDatacadastro: [],
    spaCodigo: [],
    logradouro: [],
    pessoafisica: [],
    cep: [null, [Validators.maxLength(8)]],
    cidade: [],
    estado: [],
    areAtuacao: [],
    numero: [],
    bairro: [],
    porte: [],
    abertura: [],
    naturezaJuridica: [],
    ultimaAtualizacao: [],
    status: [],
    tipo: [],
    complemento: [],
    email: [],
    telefone: [],
    dataSituacao: [],
    efr: [],
    motivoSituacao: [],
    situacaoEspecial: [],
    dataSituacaoEspecial: [],
    capitalSocial: [],
  });

  constructor(
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private viacepService: ViaCepService,
    private spinner: NgxSpinnerService,
    private cnpjService: CnpjService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      if (!parceiro.id) {
        const today = moment().startOf('day');
        parceiro.par_datacadastro = today;
      }
      this.updateForm(parceiro);
      this.mask = this.maskJuridica;
      this.editForm.controls['parRgie'].disable();
      this.editForm.patchValue({ pessoafisica: this._false });
      this.editForm.patchValue({ parTipopessoa: this.juridica });
      if (parceiro.parTipopessoa && parceiro.parTipopessoa === this.fisica) {
        this.mask = this.maskFisica;
        this.editForm.controls['parRgie'].enable();
        this.editForm.patchValue({ par_tipopessoa: this.fisica });
      }
    });
  }

  updateForm(parceiro: IParceiro): void {
    this.editForm.patchValue({
      id: parceiro.id,
      parDescricao: parceiro.parDescricao,
      parRazaosocial: parceiro.parRazaosocial,
      parTipopessoa: parceiro.parTipopessoa,
      parCnpjcpf: parceiro.parCnpjcpf,
      parRgie: parceiro.parRgie,
      parObs: parceiro.parObs,
      parDatacadastro: parceiro.parDatacadastro ? parceiro.parDatacadastro.format(DATE_TIME_FORMAT) : null,
      spaCodigo: parceiro.spaCodigo,
      logradouro: parceiro.logradouro,
      cep: parceiro.cep,
      cidade: parceiro.cidade,
      estado: parceiro.estado,
      areAtuacao: parceiro.areAtuacao,
      numero: parceiro.numero,
      bairro: parceiro.bairro,
      porte: parceiro.porte,
      abertura: parceiro.abertura,
      naturezaJuridica: parceiro.naturezaJuridica,
      ultimaAtualizacao: parceiro.ultimaAtualizacao,
      status: parceiro.status,
      tipo: parceiro.tipo,
      complemento: parceiro.complemento,
      email: parceiro.email,
      telefone: parceiro.telefone,
      dataSituacao: parceiro.dataSituacao,
      efr: parceiro.efr,
      motivoSituacao: parceiro.motivoSituacao,
      situacaoEspecial: parceiro.situacaoEspecial,
      dataSituacaoEspecial: parceiro.dataSituacaoEspecial,
      capitalSocial: parceiro.capitalSocial,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parceiro = this.createFromForm();
    if (parceiro.id !== undefined) {
      this.subscribeToSaveResponse(this.parceiroService.update(parceiro));
    } else {
      this.subscribeToSaveResponse(this.parceiroService.create(parceiro));
    }
  }

  private createFromForm(): IParceiro {
    return {
      ...new Parceiro(),
      id: this.editForm.get(['id'])!.value,
      parDescricao: this.editForm.get(['parDescricao'])!.value,
      parRazaosocial: this.editForm.get(['parRazaosocial'])!.value,
      parTipopessoa: this.editForm.get(['pessoafisica'])!.value ? this.fisica : this.juridica,
      parCnpjcpf: this.editForm.get(['parCnpjcpf'])!.value,
      parRgie: this.editForm.get(['parRgie'])!.value,
      parObs: this.editForm.get(['parObs'])!.value,
      parDatacadastro: this.editForm.get(['parDatacadastro'])!.value
        ? moment(this.editForm.get(['parDatacadastro'])!.value, DATE_TIME_FORMAT)
        : undefined,
      spaCodigo: this.editForm.get(['spaCodigo'])!.value,
      logradouro: this.editForm.get(['logradouro'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      areAtuacao: this.editForm.get(['areAtuacao'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      bairro: this.editForm.get(['bairro'])!.value,
      porte: this.editForm.get(['porte'])!.value,
      abertura: this.editForm.get(['abertura'])!.value,
      naturezaJuridica: this.editForm.get(['naturezaJuridica'])!.value,
      ultimaAtualizacao: this.editForm.get(['ultimaAtualizacao'])!.value,
      status: this.editForm.get(['status'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      complemento: this.editForm.get(['complemento'])!.value,
      email: this.editForm.get(['email'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      dataSituacao: this.editForm.get(['dataSituacao'])!.value,
      efr: this.editForm.get(['efr'])!.value,
      motivoSituacao: this.editForm.get(['motivoSituacao'])!.value,
      situacaoEspecial: this.editForm.get(['situacaoEspecial'])!.value,
      dataSituacaoEspecial: this.editForm.get(['dataSituacaoEspecial'])!.value,
      capitalSocial: this.editForm.get(['capitalSocial'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParceiro>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  onChange(): void {
    if (this.editForm.get(['pessoafisica'])!.value) {
      this.mask = this.maskFisica;
      this.editForm.controls['parRgie'].enable();
    } else {
      this.mask = this.maskJuridica;
      this.editForm.controls['parRgie'].disable();
    }
  }

  onCep(): void {
    if (this.editForm.get(['cep'])!.value) {
      this.spinner.show();
      this.viacepService.query(this.editForm.get(['cep'])!.value).subscribe(
        response => {
          this.editForm.patchValue({
            cidade: response.body?.localidade,
            estado: response.body?.uf,
            logradouro: response.body?.logradouro,
          });
          this.spinner.hide();
        },
        error => {
          console.log(error);
          this.spinner.hide();
        }
      );
    }
  }

  onCnpj(): void {
    if (!this.editForm.get(['pessoafisica'])!.value) {
      this.spinner.show();
      this.cnpjService.query(this.editForm.get(['parCnpjcpf'])!.value).subscribe(
        response => {
          const cnpjModel: CnpjModel = response.body || {};
          this.editForm.patchValue({
            par_razaosocial: cnpjModel.nome,
          });
          if (cnpjModel.atividade_principal && cnpjModel.atividade_principal.length > 0) {
            this.editForm.patchValue({
              area_atuacao: cnpjModel.atividade_principal[0].text,
              spa_codigo: cnpjModel.atividade_principal[0].code,
            });
          }

          this.spinner.hide();
        },
        error => {
          console.log(error);
          this.spinner.hide();
        }
      );
    }
  }
}
