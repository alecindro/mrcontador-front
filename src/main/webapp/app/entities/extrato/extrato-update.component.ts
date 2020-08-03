import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IExtrato, Extrato } from 'app/shared/model/extrato.model';
import { ExtratoService } from './extrato.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { AgenciabancariaService } from 'app/entities/agenciabancaria/agenciabancaria.service';

type SelectableEntity = IParceiro | IAgenciabancaria;

@Component({
  selector: 'jhi-extrato-update',
  templateUrl: './extrato-update.component.html',
})
export class ExtratoUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];
  agenciabancarias: IAgenciabancaria[] = [];

  editForm = this.fb.group({
    id: [],
    ext_datalancamento: [],
    ext_historico: [null, [Validators.maxLength(90)]],
    ext_numerodocumento: [null, [Validators.maxLength(30)]],
    ext_numerocontrole: [null, [Validators.maxLength(30)]],
    ext_debito: [],
    ext_credito: [],
    ext_descricao: [null, [Validators.maxLength(30)]],
    agenciabancariaId: [null, Validators.required],
  });

  constructor(
    protected extratoService: ExtratoService,
    protected parceiroService: ParceiroService,
    protected agenciabancariaService: AgenciabancariaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extrato }) => {
      if (!extrato.id) {
        const today = moment().startOf('day');
        extrato.ext_datalancamento = today;
      }

      this.updateForm(extrato);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));

      this.agenciabancariaService.query().subscribe((res: HttpResponse<IAgenciabancaria[]>) => (this.agenciabancarias = res.body || []));
    });
  }

  updateForm(extrato: IExtrato): void {
    this.editForm.patchValue({
      id: extrato.id,
      ext_datalancamento: extrato.extDatalancamento ? extrato.extDatalancamento.format(DATE_TIME_FORMAT) : null,
      ext_historico: extrato.extHistorico,
      ext_numerodocumento: extrato.extNumerodocumento,
      ext_numerocontrole: extrato.extNumerocontrole,
      ext_debito: extrato.extDebito,
      ext_credito: extrato.extCredito,
      ext_descricao: extrato.extDescricao,
      agenciabancariaId: extrato.agenciabancaria,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const extrato = this.createFromForm();
    if (extrato.id !== undefined) {
      this.subscribeToSaveResponse(this.extratoService.update(extrato));
    } else {
      this.subscribeToSaveResponse(this.extratoService.create(extrato));
    }
  }

  private createFromForm(): IExtrato {
    return {
      ...new Extrato(),
      id: this.editForm.get(['id'])!.value,
      extDatalancamento: this.editForm.get(['ext_datalancamento'])!.value
        ? moment(this.editForm.get(['ext_datalancamento'])!.value, DATE_TIME_FORMAT)
        : undefined,
      extHistorico: this.editForm.get(['ext_historico'])!.value,
      extNumerodocumento: this.editForm.get(['ext_numerodocumento'])!.value,
      extNumerocontrole: this.editForm.get(['ext_numerocontrole'])!.value,
      extDebito: this.editForm.get(['ext_debito'])!.value,
      extCredito: this.editForm.get(['ext_credito'])!.value,
      extDescricao: this.editForm.get(['ext_descricao'])!.value,
      agenciabancaria: this.editForm.get(['agenciabancariaId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtrato>>): void {
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
