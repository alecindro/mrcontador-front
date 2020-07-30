import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IAgenciabancaria, Agenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { AgenciabancariaService } from './agenciabancaria.service';
import { IBanco } from 'app/shared/model/banco.model';
import { BancoService } from 'app/entities/banco/banco.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';

type SelectableEntity = IBanco | IParceiro;

@Component({
  selector: 'jhi-agenciabancaria-update',
  templateUrl: './agenciabancaria-update.component.html',
})
export class AgenciabancariaUpdateComponent implements OnInit {
  isSaving = false;
  searchingBanco = false;
  searchFailedBanco = false;
  searchingParceiro = false;
  searchFailedParceiro = false;
  bancos: IBanco[] = [];
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    age_numero: [null, [Validators.maxLength(20)]],
    age_digito: [null, [Validators.maxLength(20)]],
    age_agencia: [null, [Validators.maxLength(6)]],
    age_descricao: [null, [Validators.maxLength(30)]],
    age_situacao: [],
    bancoId: [null, Validators.required],
    parceiroId: [null, Validators.required],
    banco_id: [],
    ban_descricao: [],
    ban_codigobancario: [],
    parceiro_id: [],
    par_razaosocial: [],
  });

  constructor(
    protected agenciabancariaService: AgenciabancariaService,
    protected bancoService: BancoService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agenciabancaria }) => {
      if (!agenciabancaria.id) {
        agenciabancaria.age_situacao = true;
      }
      this.updateForm(agenciabancaria);
    });
  }

  updateForm(agenciabancaria: IAgenciabancaria): void {
    this.editForm.patchValue({
      id: agenciabancaria.id,
      age_numero: agenciabancaria.ageNumero,
      age_digito: agenciabancaria.ageDigito,
      age_agencia: agenciabancaria.ageAgencia,
      age_descricao: agenciabancaria.ageDescricao,
      age_situacao: agenciabancaria.ageSituacao,
      bancoId: agenciabancaria.banco,
      parceiroId: agenciabancaria.parceiro,
    });
    if (agenciabancaria.banco) {
      this.editForm.patchValue({
        bancoId: agenciabancaria.banco.id,
        banco_id: agenciabancaria.banco.id,
        ban_descricao: agenciabancaria.banco.banDescricao,
        ban_codigobancario: agenciabancaria.banco.banCodigobancario,
      });
    }
    if (agenciabancaria.parceiro) {
      this.editForm.patchValue({
        parceiroId: agenciabancaria.parceiro.id,
        parceiro_id: agenciabancaria.parceiro.id,
        par_razaosocial: agenciabancaria.parceiro.parRazaosocial,
      });
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
    return {
      ...new Agenciabancaria(),
      id: this.editForm.get(['id'])!.value,
      ageNumero: this.editForm.get(['age_numero'])!.value,
      ageDigito: this.editForm.get(['age_digito'])!.value,
      ageAgencia: this.editForm.get(['age_agencia'])!.value,
      ageDescricao: this.editForm.get(['age_descricao'])!.value,
      ageSituacao: this.editForm.get(['age_situacao'])!.value,
      banco: this.editForm.get(['bancoId'])!.value,
      parceiro: this.editForm.get(['parceiroId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgenciabancaria>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  searchBanco = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingBanco = true)),
      switchMap(term =>
        term.length < 3
          ? ((this.searchingBanco = false), [])
          : this.bancoService
              .query({ 'ban_descricao.contains': term })
              .pipe(map((res: HttpResponse<IBanco[]>) => (this.bancos = res.body || [])))
              .pipe(
                tap(() => (this.searchFailedBanco = false)),
                catchError(() => {
                  this.searchFailedBanco = true;
                  return of([]);
                })
              )
      ),
      tap(() => (this.searchingBanco = false))
    );

  resultFormatBanco(value: any): string {
    return value.ban_descricao || '';
  }

  inputFormatBanco(value: any): any {
    if (value.ban_codigobancario) {
      return value.ban_descricao;
    }
    return value;
  }

  selectedBanco(event: any): void {
    this.editForm.patchValue({ bancoId: event.item.id });
  }

  searchParceiro = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingParceiro = true)),
      switchMap(term =>
        term.length < 3
          ? ((this.searchingParceiro = false), [])
          : this.parceiroService
              .query({ 'par_razaosocial.contains': term, 'par_cnpjcpf.contains': term })
              .pipe(map((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || [])))
              .pipe(
                tap(() => (this.searchFailedParceiro = false)),
                catchError(() => {
                  this.searchFailedParceiro = true;
                  return of([]);
                })
              )
      ),
      tap(() => (this.searchingParceiro = false))
    );

  resultFormatParceiro(value: any): string {
    return value.par_razaosocial || '';
  }

  inputFormatParceiro(value: any): any {
    return value.par_razaosocial ? value.par_razaosocial : value;
  }

  selectedParceiro(event: any): void {
    this.editForm.patchValue({ parceiroId: event.item.id });
  }
}
