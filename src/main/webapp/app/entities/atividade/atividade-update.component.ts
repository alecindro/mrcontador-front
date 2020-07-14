import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IAtividade, Atividade } from 'app/shared/model/atividade.model';
import { AtividadeService } from './atividade.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

@Component({
  selector: 'jhi-atividade-update',
  templateUrl: './atividade-update.component.html',
})
export class AtividadeUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    descricao: [],
    code: [],
    tipo: [],
    parceiro: [null, Validators.required],
  });

  constructor(
    protected atividadeService: AtividadeService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atividade }) => {
      this.updateForm(atividade);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(atividade: IAtividade): void {
    this.editForm.patchValue({
      id: atividade.id,
      descricao: atividade.descricao,
      code: atividade.code,
      tipo: atividade.tipo,
      parceiro: atividade.parceiro,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const atividade = this.createFromForm();
    if (atividade.id !== undefined) {
      this.subscribeToSaveResponse(this.atividadeService.update(atividade));
    } else {
      this.subscribeToSaveResponse(this.atividadeService.create(atividade));
    }
  }

  private createFromForm(): IAtividade {
    return {
      ...new Atividade(),
      id: this.editForm.get(['id'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      code: this.editForm.get(['code'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      parceiro: this.editForm.get(['parceiro'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAtividade>>): void {
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
