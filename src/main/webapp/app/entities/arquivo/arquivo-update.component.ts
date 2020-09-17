import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IArquivo, Arquivo } from 'app/shared/model/arquivo.model';
import { ArquivoService } from './arquivo.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

@Component({
  selector: 'jhi-arquivo-update',
  templateUrl: './arquivo-update.component.html',
})
export class ArquivoUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    nomeOriginal: [],
    dataCadastro: [],
    tipoArquivo: [],
    tipoDoc: [],
    s3Url: [],
    s3Dir: [],
    tamanho: [],
    etag: [],
    usuario: [],
    parceiro: [null, Validators.required],
  });

  constructor(
    protected arquivoService: ArquivoService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arquivo }) => {
      if (!arquivo.id) {
        const today = moment().startOf('day');
        arquivo.dataCadastro = today;
      }

      this.updateForm(arquivo);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(arquivo: IArquivo): void {
    this.editForm.patchValue({
      id: arquivo.id,
      nome: arquivo.nome,
      nomeOriginal: arquivo.nomeOriginal,
      dataCadastro: arquivo.dataCadastro ? arquivo.dataCadastro.format(DATE_TIME_FORMAT) : null,
      tipoArquivo: arquivo.tipoArquivo,
      tipoDoc: arquivo.tipoDoc,
      s3Url: arquivo.s3Url,
      s3Dir: arquivo.s3Dir,
      tamanho: arquivo.tamanho,
      etag: arquivo.etag,
      usuario: arquivo.usuario,
      parceiro: arquivo.parceiro,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const arquivo = this.createFromForm();
    if (arquivo.id !== undefined) {
      this.subscribeToSaveResponse(this.arquivoService.update(arquivo));
    } else {
      this.subscribeToSaveResponse(this.arquivoService.create(arquivo));
    }
  }

  private createFromForm(): IArquivo {
    return {
      ...new Arquivo(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      nomeOriginal: this.editForm.get(['nomeOriginal'])!.value,
      dataCadastro: this.editForm.get(['dataCadastro'])!.value
        ? moment(this.editForm.get(['dataCadastro'])!.value, DATE_TIME_FORMAT)
        : undefined,
      tipoArquivo: this.editForm.get(['tipoArquivo'])!.value,
      tipoDoc: this.editForm.get(['tipoDoc'])!.value,
      s3Url: this.editForm.get(['s3Url'])!.value,
      s3Dir: this.editForm.get(['s3Dir'])!.value,
      tamanho: this.editForm.get(['tamanho'])!.value,
      etag: this.editForm.get(['etag'])!.value,
      usuario: this.editForm.get(['usuario'])!.value,
      parceiro: this.editForm.get(['parceiro'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArquivo>>): void {
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
