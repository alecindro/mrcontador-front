import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IArquivoerro, Arquivoerro } from 'app/model/arquivoerro.model';
import { ArquivoerroService } from './arquivoerro.service';

@Component({
  selector: 'jhi-arquivoerro-update',
  templateUrl: './arquivoerro-update.component.html',
})
export class ArquivoerroUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
    nomeOriginal: [],
    tipoArquivo: [],
    s3Url: [],
    s3Dir: [],
    dataCadastro: [],
    usuario: [],
    contador: [],
    tamanho: [],
  });

  constructor(protected arquivoerroService: ArquivoerroService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arquivoerro }) => {
      if (!arquivoerro.id) {
        const today = moment().startOf('day');
        arquivoerro.dataCadastro = today;
      }

      this.updateForm(arquivoerro);
    });
  }

  updateForm(arquivoerro: IArquivoerro): void {
    this.editForm.patchValue({
      id: arquivoerro.id,
      nome: arquivoerro.nome,
      nomeOriginal: arquivoerro.nomeOriginal,
      tipoArquivo: arquivoerro.tipoArquivo,
      s3Url: arquivoerro.s3Url,
      s3Dir: arquivoerro.s3Dir,
      dataCadastro: arquivoerro.dataCadastro ? arquivoerro.dataCadastro.format(DATE_TIME_FORMAT) : null,
      usuario: arquivoerro.usuario,
      contador: arquivoerro.contador,
      tamanho: arquivoerro.tamanho,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const arquivoerro = this.createFromForm();
    if (arquivoerro.id !== undefined) {
      this.subscribeToSaveResponse(this.arquivoerroService.update(arquivoerro));
    } else {
      this.subscribeToSaveResponse(this.arquivoerroService.create(arquivoerro));
    }
  }

  private createFromForm(): IArquivoerro {
    return {
      ...new Arquivoerro(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      nomeOriginal: this.editForm.get(['nomeOriginal'])!.value,
      tipoArquivo: this.editForm.get(['tipoArquivo'])!.value,
      s3Url: this.editForm.get(['s3Url'])!.value,
      s3Dir: this.editForm.get(['s3Dir'])!.value,
      dataCadastro: this.editForm.get(['dataCadastro'])!.value
        ? moment(this.editForm.get(['dataCadastro'])!.value, DATE_TIME_FORMAT)
        : undefined,
      usuario: this.editForm.get(['usuario'])!.value,
      contador: this.editForm.get(['contador'])!.value,
      tamanho: this.editForm.get(['tamanho'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArquivoerro>>): void {
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
