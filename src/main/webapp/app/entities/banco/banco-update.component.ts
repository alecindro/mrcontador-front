import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IBanco, Banco } from 'app/model/banco.model';
import { BancoService } from '../../services/banco.service';

@Component({
  selector: 'jhi-banco-update',
  templateUrl: './banco-update.component.html',
})
export class BancoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    ban_descricao: [null, [Validators.maxLength(200)]],
    ban_codigobancario: [],
    ban_sigla: [null, [Validators.maxLength(100)]],
    ban_ispb: [],
  });

  constructor(protected bancoService: BancoService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ banco }) => {
      this.updateForm(banco);
    });
  }

  updateForm(banco: IBanco): void {
    this.editForm.patchValue({
      id: banco.id,
      ban_descricao: banco.banDescricao,
      ban_codigobancario: banco.banCodigobancario,
      ban_sigla: banco.banSigla,
      ban_ispb: banco.banIspb,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const banco = this.createFromForm();
    if (banco.id !== undefined) {
      this.subscribeToSaveResponse(this.bancoService.update(banco));
    } else {
      this.subscribeToSaveResponse(this.bancoService.create(banco));
    }
  }

  private createFromForm(): IBanco {
    return {
      ...new Banco(),
      id: this.editForm.get(['id'])!.value,
      banDescricao: this.editForm.get(['ban_descricao'])!.value,
      banCodigobancario: this.editForm.get(['ban_codigobancario'])!.value,
      banSigla: this.editForm.get(['ban_sigla'])!.value,
      banIspb: this.editForm.get(['ban_ispb'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBanco>>): void {
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
