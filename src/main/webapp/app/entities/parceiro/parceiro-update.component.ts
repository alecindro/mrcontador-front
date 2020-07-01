import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IParceiro, Parceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from './parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViaCepService } from 'app/shared/services/viacepservice';

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
    par_descricao: [null, [Validators.maxLength(50)]],
    par_razaosocial: [null, [Validators.maxLength(70), Validators.required]],
    par_tipopessoa: [null, [Validators.maxLength(1)]],
    par_cnpjcpf: [null, [Validators.maxLength(20), Validators.required]],
    par_rgie: [null, [Validators.maxLength(20)]],
    par_obs: [null, [Validators.maxLength(200)]],
    par_datacadastro: [],
    spa_codigo: [],
    logradouro: [],
    pessoafisica: [],
    cep: [null, [Validators.maxLength(8)]],
    cidade: [],
    estado: [],
    area_atuacao: [],
    comercio: [null, [Validators.required]],
    nfc_e: [],
    danfe: [],
    servico: [],
    nfs_e: [],
    transportadora: [],
    conhec_transporte: [],
    industria: [],
    ct: [],
    outras: [],
  });

  constructor(
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private viacepService: ViaCepService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      if (!parceiro.id) {
        const today = moment().startOf('day');
        parceiro.par_datacadastro = today;
      }
      this.updateForm(parceiro);
      this.mask = this.maskJuridica;
      this.editForm.controls['par_rgie'].disable();
      this.editForm.patchValue({ pessoafisica: this._false });
      this.editForm.patchValue({ par_tipopessoa: this.juridica });
      if (parceiro.par_tipopessoa && parceiro.par_tipopessoa === this.fisica) {
        this.mask = this.maskFisica;
        this.editForm.controls['par_rgie'].enable();
        this.editForm.patchValue({ par_tipopessoa: this.fisica });
      }
    });
  }

  updateForm(parceiro: IParceiro): void {
    this.editForm.patchValue({
      id: parceiro.id,
      par_descricao: parceiro.par_descricao,
      par_razaosocial: parceiro.par_razaosocial,
      par_tipopessoa: parceiro.par_tipopessoa,
      par_cnpjcpf: parceiro.par_cnpjcpf,
      par_rgie: parceiro.par_rgie,
      par_obs: parceiro.par_obs,
      par_datacadastro: parceiro.par_datacadastro ? parceiro.par_datacadastro.format(DATE_TIME_FORMAT) : null,
      spa_codigo: parceiro.spa_codigo,
      logradouro: parceiro.logradouro,
      cep: parceiro.cep,
      cidade: parceiro.cidade,
      estado: parceiro.estado,
      area_atuacao: parceiro.area_atuacao,
      comercio: parceiro.comercio,
      nfc_e: parceiro.nfc_e,
      danfe: parceiro.danfe,
      servico: parceiro.servico,
      nfs_e: parceiro.nfs_e,
      transportadora: parceiro.transportadora,
      conhec_transporte: parceiro.conhec_transporte,
      industria: parceiro.industria,
      ct: parceiro.ct,
      outras: parceiro.outras,
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
      par_descricao: this.editForm.get(['par_descricao'])!.value,
      par_razaosocial: this.editForm.get(['par_razaosocial'])!.value,
      par_tipopessoa: this.editForm.get(['pessoafisica'])!.value ? this.fisica : this.juridica,
      par_cnpjcpf: this.editForm.get(['par_cnpjcpf'])!.value,
      par_rgie: this.editForm.get(['par_rgie'])!.value,
      par_obs: this.editForm.get(['par_obs'])!.value,
      par_datacadastro: this.editForm.get(['par_datacadastro'])!.value
        ? moment(this.editForm.get(['par_datacadastro'])!.value, DATE_TIME_FORMAT)
        : undefined,
      spa_codigo: this.editForm.get(['spa_codigo'])!.value,
      logradouro: this.editForm.get(['logradouro'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      area_atuacao: this.editForm.get(['area_atuacao'])!.value,
      comercio: this.editForm.get(['comercio'])!.value,
      nfc_e: this.editForm.get(['nfc_e'])!.value,
      danfe: this.editForm.get(['danfe'])!.value,
      servico: this.editForm.get(['servico'])!.value,
      nfs_e: this.editForm.get(['nfs_e'])!.value,
      transportadora: this.editForm.get(['transportadora'])!.value,
      conhec_transporte: this.editForm.get(['conhec_transporte'])!.value,
      industria: this.editForm.get(['industria'])!.value,
      ct: this.editForm.get(['ct'])!.value,
      outras: this.editForm.get(['outras'])!.value,
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
      this.editForm.controls['par_rgie'].enable();
    } else {
      this.mask = this.maskJuridica;
      this.editForm.controls['par_rgie'].disable();
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
}
