import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IConta, Conta } from 'app/shared/model/conta.model';
import { ContaService } from './conta.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

@Component({
  selector: 'jhi-conta-update',
  templateUrl: './conta-update.component.html',
})
export class ContaUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    con_conta: [],
    con_classificacao: [null, [Validators.maxLength(20)]],
    con_tipo: [null, [Validators.maxLength(1)]],
    con_descricao: [null, [Validators.maxLength(60)]],
    con_cnpj: [null, [Validators.maxLength(18)]],
    con_grau: [],
    parceiroId: [],
  });

  constructor(
    protected contaService: ContaService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conta }) => {
      this.updateForm(conta);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(conta: IConta): void {
    this.editForm.patchValue({
      id: conta.id,
      con_conta: conta.con_conta,
      con_classificacao: conta.con_classificacao,
      con_tipo: conta.con_tipo,
      con_descricao: conta.con_descricao,
      con_cnpj: conta.con_cnpj,
      con_grau: conta.con_grau,
      parceiroId: conta.parceiroId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conta = this.createFromForm();
    if (conta.id !== undefined) {
      this.subscribeToSaveResponse(this.contaService.update(conta));
    } else {
      this.subscribeToSaveResponse(this.contaService.create(conta));
    }
  }

  private createFromForm(): IConta {
    return {
      ...new Conta(),
      id: this.editForm.get(['id'])!.value,
      con_conta: this.editForm.get(['con_conta'])!.value,
      con_classificacao: this.editForm.get(['con_classificacao'])!.value,
      con_tipo: this.editForm.get(['con_tipo'])!.value,
      con_descricao: this.editForm.get(['con_descricao'])!.value,
      con_cnpj: this.editForm.get(['con_cnpj'])!.value,
      con_grau: this.editForm.get(['con_grau'])!.value,
      parceiroId: this.editForm.get(['parceiroId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConta>>): void {
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

  trackById(index: number, item: IParceiro): any {
    return item.id;
  }
}
