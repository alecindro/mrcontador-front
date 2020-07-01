import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IRegra, Regra } from 'app/shared/model/regra.model';
import { RegraService } from './regra.service';

@Component({
  selector: 'jhi-regra-update',
  templateUrl: './regra-update.component.html',
})
export class RegraUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    par_codigo: [],
    reg_descricao: [null, [Validators.maxLength(60)]],
    reg_conta: [],
    reg_historico: [null, [Validators.maxLength(60)]],
    reg_todos: [null, [Validators.maxLength(1)]],
  });

  constructor(protected regraService: RegraService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ regra }) => {
      this.updateForm(regra);
    });
  }

  updateForm(regra: IRegra): void {
    this.editForm.patchValue({
      id: regra.id,
      par_codigo: regra.par_codigo,
      reg_descricao: regra.reg_descricao,
      reg_conta: regra.reg_conta,
      reg_historico: regra.reg_historico,
      reg_todos: regra.reg_todos,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const regra = this.createFromForm();
    if (regra.id !== undefined) {
      this.subscribeToSaveResponse(this.regraService.update(regra));
    } else {
      this.subscribeToSaveResponse(this.regraService.create(regra));
    }
  }

  private createFromForm(): IRegra {
    return {
      ...new Regra(),
      id: this.editForm.get(['id'])!.value,
      par_codigo: this.editForm.get(['par_codigo'])!.value,
      reg_descricao: this.editForm.get(['reg_descricao'])!.value,
      reg_conta: this.editForm.get(['reg_conta'])!.value,
      reg_historico: this.editForm.get(['reg_historico'])!.value,
      reg_todos: this.editForm.get(['reg_todos'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegra>>): void {
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
}
