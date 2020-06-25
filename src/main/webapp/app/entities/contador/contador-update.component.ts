import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IContador, Contador } from 'app/shared/model/contador.model';
import { ContadorService } from './contador.service';

@Component({
  selector: 'jhi-contador-update',
  templateUrl: './contador-update.component.html',
})
export class ContadorUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    razao: ['', [Validators.required, Validators.maxLength(254)]],
    fantasia: ['', [Validators.required, Validators.maxLength(254)]],
    telefones: ['', [Validators.maxLength(254)]],
    datasource: [],
    cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]],
    cidade: ['', [Validators.required, Validators.maxLength(254)]],
    estado: ['', [Validators.maxLength(254)]],
    cep: ['', [Validators.minLength(8), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
  });

  constructor(protected contadorService: ContadorService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contador }) => {
      this.updateForm(contador);
    });
  }

  updateForm(contador: IContador): void {
    this.editForm.patchValue({
      id: contador.id,
      razao: contador.razao,
      fantasia: contador.fantasia,
      telefones: contador.telefones,
      datasource: contador.datasource,
      cnpj: contador.cnpj,
      cidade: contador.cidade,
      estado: contador.estado,
      cep: contador.cep,
      email: contador.email,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contador = this.createFromForm();
    if (contador.id !== undefined) {
      this.subscribeToSaveResponse(this.contadorService.update(contador));
    } else {
      this.subscribeToSaveResponse(this.contadorService.create(contador));
    }
  }

  private createFromForm(): IContador {
    return {
      ...new Contador(),
      id: this.editForm.get(['id'])!.value,
      razao: this.editForm.get(['razao'])!.value,
      fantasia: this.editForm.get(['fantasia'])!.value,
      telefones: this.editForm.get(['telefones'])!.value,
      datasource: this.editForm.get(['datasource'])!.value,
      cnpj: this.editForm.get(['cnpj'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      email: this.editForm.get(['email'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContador>>): void {
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
