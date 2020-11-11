import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IBanco } from '../../model/banco.model';
import { IParceiro } from '../../model/parceiro.model';
import { IConta } from '../../model/conta.model';
import { ParceiroService } from '../../services/parceiro.service';
import { IAgenciabancaria, Agenciabancaria } from '../../model/agenciabancaria.model';
import { AgenciabancariaService } from '../../services/agenciabancaria.service';
import { BancoService } from '../../services/banco.service';
import { TipoAgencia } from '../../shared/constants/TipoAgencia';
import { AgenciabancariaAplicacao } from '../../shared/dto/agenciabancariaAplicacao';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpResponse } from '@angular/common/http';

type SelectableEntity = IBanco | IParceiro;

@Component({
  selector: 'jhi-agencia',
  templateUrl: './agencia.component.html',
})
export class AgenciaComponent implements OnInit {
  @Input()
  parceiro!: IParceiro;

  isSaving = false;
  contemAplicacao = false;
  searchingBanco = false;
  searchFailedBanco = false;
  searchingParceiro = false;
  searchFailedParceiro = false;
  bancos!: IBanco[];
  conta?: IConta;
  contaAplicacao?: IConta;
  agencias: IAgenciabancaria[] = [];

  editForm = this.fb.group({
    id: [],
    age_numero: [null, [Validators.maxLength(20), Validators.required]],
    age_digito: [null, [Validators.maxLength(20), Validators.required]],
    age_agencia: [null, [Validators.maxLength(6), Validators.required]],
    age_descricao: [null, [Validators.maxLength(30)]],
    age_situacao: [],
    bancoId: [null, Validators.required],
    possueAplicacao: [],
    tipoAgencia: [],
  });

  constructor(
    protected agenciabancariaService: AgenciabancariaService,
    protected bancoService: BancoService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.parceiro?.id) {
      this.loadAgencias();
    }
    this.loadBancos();
  }

  loadAgencias() {
    this.spinner.show();
    const queryParam = {
      'parceiroId.equals': this.parceiro.id,
    };
    this.agenciabancariaService.query(queryParam).subscribe(
      (res: HttpResponse<IAgenciabancaria[]>) => {
        this.agencias = res.body || [];
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  updateForm(agenciabancaria: IAgenciabancaria): void {
    this.editForm.patchValue({
      id: agenciabancaria?.id,
      age_numero: agenciabancaria?.ageNumero,
      age_digito: agenciabancaria?.ageDigito,
      age_agencia: agenciabancaria?.ageAgencia,
      age_descricao: agenciabancaria?.ageDescricao,
      age_situacao: agenciabancaria?.ageSituacao,
      possueAplicacao: agenciabancaria?.possueAplicacao,
      tipoAgencia: agenciabancaria?.tipoAgencia,
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

  save(): void {
    this.isSaving = true;
    const agenciabancaria = this.createFromForm();
    if (!this.contemAplicacao && agenciabancaria.possueAplicacao) {
      agenciabancaria.tipoAgencia = TipoAgencia[TipoAgencia.CONTA];
      const agenciabancariaAplicacao = new AgenciabancariaAplicacao(agenciabancaria, this.contaAplicacao, true);
      this.agenciabancariaService.createAplicao(agenciabancariaAplicacao).subscribe(
        response => {
          this.updateForm(new Agenciabancaria());
          const _agencia = response.body;
          if (_agencia) this.agencias.push(_agencia);
          this.isSaving = false;
        },
        () => (this.isSaving = false)
      );
    } else {
      this.agenciabancariaService.create(agenciabancaria);
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
      tipoAgencia: this.editForm.get(['tipoAgencia'])!.value,
      possueAplicacao: this.editForm.get(['possueAplicacao'])!.value,
      conta: this.conta,
      banco: _banco,
      parceiro: this.parceiro,
      banCodigobancario: _banco?.banCodigobancario,
    };
  }

  loadBancos(): void {
    this.bancoService.get().subscribe(response => {
      this.bancos = response.body || [];
    });
  }

  selectedConta(conta: IConta): void {
    this.conta = conta;
  }

  selectedContaAplicacao(conta: IConta): void {
    this.contaAplicacao = conta;
  }

  delete(agenciabancaria: IAgenciabancaria): void {
    this.agenciabancariaService.delete(agenciabancaria?.id!).subscribe(() => {
      const index = this.agencias.indexOf(agenciabancaria);
      if (index !== -1) {
        this.agencias.splice(index, 1);
      }
    });
  }

  public edit(agenciabancaria: IAgenciabancaria): void {
    this.updateForm(agenciabancaria);
  }
}
