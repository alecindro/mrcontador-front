import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IAgenciabancaria, Agenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { AgenciabancariaService } from './agenciabancaria.service';
import { IBanco } from 'app/shared/model/banco.model';
import { BancoService } from 'app/entities/banco/banco.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

type SelectableEntity = IBanco | IParceiro;

@Component({
  selector: 'jhi-agenciabancaria-update',
  templateUrl: './agenciabancaria-update.component.html',
})
export class AgenciabancariaUpdateComponent implements OnInit {
  isSaving = false;
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
      this.updateForm(agenciabancaria);

      this.bancoService.query().subscribe((res: HttpResponse<IBanco[]>) => (this.bancos = res.body || []));

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(agenciabancaria: IAgenciabancaria): void {
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
}
