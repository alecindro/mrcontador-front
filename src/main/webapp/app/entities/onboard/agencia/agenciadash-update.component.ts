import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IAgenciabancaria, Agenciabancaria } from 'app/model/agenciabancaria.model';
import { AgenciabancariaService } from 'app/services/agenciabancaria.service';
import { IBanco } from 'app/model/banco.model';
import { BancoService } from 'app/services/banco.service';
import { IParceiro } from 'app/model/parceiro.model';
import { ParceiroService } from 'app/services/parceiro.service';
import { JhiEventManager } from 'ng-jhipster';
import { IConta } from 'app/model/conta.model';

type SelectableEntity = IBanco | IParceiro;

@Component({
  selector: 'jhi-agenciadash-update',
  templateUrl: './agenciadash-update.component.html',
})
export class AgenciaDashUpdateComponent implements OnInit {
  isSaving = false;
  searchingBanco = false;
  searchFailedBanco = false;
  searchingParceiro = false;
  searchFailedParceiro = false;
  bancos!: IBanco[];
  parceiros: IParceiro[] = [];
  parceiro!: IParceiro;
  conta?: IConta;

  editForm = this.fb.group({
    id: [],
    age_numero: [null, [Validators.maxLength(20), Validators.required]],
    age_digito: [null, [Validators.maxLength(20), Validators.required]],
    age_agencia: [null, [Validators.maxLength(6), Validators.required]],
    age_descricao: [null, [Validators.maxLength(30)]],
    age_situacao: [],
    bancoId: [null, Validators.required],
  });

  constructor(
    protected agenciabancariaService: AgenciabancariaService,
    protected bancoService: BancoService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    protected eventManager: JhiEventManager,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    const agenciabancaria = this.agenciabancariaService.getAgenciaSelected();
    if (agenciabancaria?.id) {
      agenciabancaria.ageSituacao = true;
    }
    this.updateForm(agenciabancaria);
    this.loadBancos();
  }

  updateForm(agenciabancaria: IAgenciabancaria): void {
    this.editForm.patchValue({
      id: agenciabancaria?.id,
      age_numero: agenciabancaria?.ageNumero,
      age_digito: agenciabancaria?.ageDigito,
      age_agencia: agenciabancaria?.ageAgencia,
      age_descricao: agenciabancaria?.ageDescricao,
      age_situacao: agenciabancaria?.ageSituacao,
    });
    if (agenciabancaria?.banco) {
      this.editForm.patchValue({
        bancoId: agenciabancaria.banco.id,
      });
    }
    if (agenciabancaria?.conta) {
      this.conta = agenciabancaria.conta;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agenciabancaria = this.createFromForm();
    if (agenciabancaria.id !== undefined) {
      this.subscribeToSaveResponse(this.agenciabancariaService.update(agenciabancaria));
    } else {
      this.subscribeToSaveResponse(this.agenciabancariaService.create(agenciabancaria));
    }
  }

  private createFromForm(): IAgenciabancaria {
    const _banco = this.bancos.find((banco, index) => {
      if (banco.id === this.editForm.get(['bancoId'])!.value) {
        return true;
      } else {
        return false;
      }
    });
    return {
      ...new Agenciabancaria(),
      id: this.editForm.get(['id'])!.value,
      ageNumero: this.editForm.get(['age_numero'])!.value,
      ageDigito: this.editForm.get(['age_digito'])!.value,
      ageAgencia: this.editForm.get(['age_agencia'])!.value,
      ageDescricao: this.editForm.get(['age_descricao'])!.value,
      ageSituacao: this.editForm.get(['age_situacao'])!.value,
      conta: this.conta,
      banco: _banco,
      parceiro: this.parceiro,
      banCodigobancario: _banco?.banCodigobancario,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgenciabancaria>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.eventManager.broadcast('agenciasaved');
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  loadBancos(): void {
    this.bancoService.get().subscribe(response => {
      this.bancos = response.body || [];
    });
  }

  selectedConta(conta: IConta): void {
    this.conta = conta;
  }
}
