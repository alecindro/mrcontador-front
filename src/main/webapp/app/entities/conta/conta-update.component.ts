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
      con_conta: conta.conConta,
      con_classificacao: conta.conClassificacao,
      con_tipo: conta.conTipo,
      con_descricao: conta.conDescricao,
      con_cnpj: conta.conCnpj,
      con_grau: conta.conGrau,
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
      conConta: this.editForm.get(['con_conta'])!.value,
      conClassificacao: this.editForm.get(['con_classificacao'])!.value,
      conTipo: this.editForm.get(['con_tipo'])!.value,
      conDescricao: this.editForm.get(['con_descricao'])!.value,
      conCnpj: this.editForm.get(['con_cnpj'])!.value,
      conGrau: this.editForm.get(['con_grau'])!.value,
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
