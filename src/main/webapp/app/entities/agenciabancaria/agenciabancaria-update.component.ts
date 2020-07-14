import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IAgenciabancaria, Agenciabancaria, AgenciabancariaDTO } from 'app/shared/model/agenciabancaria.model';
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

  updateForm(agenciabancaria: AgenciabancariaDTO): void {
    this.editForm.patchValue({
      id: agenciabancaria.id,
      age_numero: agenciabancaria.age_numero,
      age_digito: agenciabancaria.age_digito,
      age_agencia: agenciabancaria.age_agencia,
      age_descricao: agenciabancaria.age_descricao,
      age_situacao: agenciabancaria.age_situacao,
      bancoId: agenciabancaria.bancoId,
      parceiroId: agenciabancaria.parceiroId,
    });
    if (agenciabancaria.banco) {
      this.editForm.patchValue({
        bancoId: agenciabancaria.banco.id,
        banco_id: agenciabancaria.banco.id,
        ban_descricao: agenciabancaria.banco.ban_descricao,
        ban_codigobancario: agenciabancaria.banco.ban_codigobancario,
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
      age_numero: this.editForm.get(['age_numero'])!.value,
      age_digito: this.editForm.get(['age_digito'])!.value,
      age_agencia: this.editForm.get(['age_agencia'])!.value,
      age_descricao: this.editForm.get(['age_descricao'])!.value,
      age_situacao: this.editForm.get(['age_situacao'])!.value,
      bancoId: this.editForm.get(['bancoId'])!.value,
      parceiroId: this.editForm.get(['parceiroId'])!.value,
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
