import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IComprovante, Comprovante } from 'app/shared/model/comprovante.model';
import { ComprovanteService } from './comprovante.service';

@Component({
  selector: 'jhi-comprovante-update',
  templateUrl: './comprovante-update.component.html',
})
export class ComprovanteUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    par_codigo: [],
    age_codigo: [],
    com_cnpj: [null, [Validators.maxLength(18)]],
    com_beneficiario: [null, [Validators.maxLength(60)]],
    com_documento: [null, [Validators.maxLength(25)]],
    com_datavencimento: [],
    com_datapagamento: [],
    com_valordocumento: [],
    com_valorpagamento: [],
    com_observacao: [null, [Validators.maxLength(90)]],
  });

  constructor(protected comprovanteService: ComprovanteService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comprovante }) => {
      if (!comprovante.id) {
        const today = moment().startOf('day');
        comprovante.com_datavencimento = today;
        comprovante.com_datapagamento = today;
      }

      this.updateForm(comprovante);
    });
  }

  updateForm(comprovante: IComprovante): void {
    this.editForm.patchValue({
      id: comprovante.id,
      par_codigo: comprovante.parCodigo,
      age_codigo: comprovante.ageCodigo,
      com_cnpj: comprovante.comCnpj,
      com_beneficiario: comprovante.comBeneficiario,
      com_documento: comprovante.comDocumento,
      com_datavencimento: comprovante.comDatavencimento ? comprovante.comDatavencimento.format(DATE_TIME_FORMAT) : null,
      com_datapagamento: comprovante.comDatapagamento ? comprovante.comDatapagamento.format(DATE_TIME_FORMAT) : null,
      com_valordocumento: comprovante.comValordocumento,
      com_valorpagamento: comprovante.comValorpagamento,
      com_observacao: comprovante.comObservacao,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comprovante = this.createFromForm();
    if (comprovante.id !== undefined) {
      this.subscribeToSaveResponse(this.comprovanteService.update(comprovante));
    } else {
      this.subscribeToSaveResponse(this.comprovanteService.create(comprovante));
    }
  }

  private createFromForm(): IComprovante {
    return {
      ...new Comprovante(),
      id: this.editForm.get(['id'])!.value,
      parCodigo: this.editForm.get(['par_codigo'])!.value,
      ageCodigo: this.editForm.get(['age_codigo'])!.value,
      comCnpj: this.editForm.get(['com_cnpj'])!.value,
      comBeneficiario: this.editForm.get(['com_beneficiario'])!.value,
      comDocumento: this.editForm.get(['com_documento'])!.value,
      comDatavencimento: this.editForm.get(['com_datavencimento'])!.value
        ? moment(this.editForm.get(['com_datavencimento'])!.value, DATE_TIME_FORMAT)
        : undefined,
      comDatapagamento: this.editForm.get(['com_datapagamento'])!.value
        ? moment(this.editForm.get(['com_datapagamento'])!.value, DATE_TIME_FORMAT)
        : undefined,
      comValordocumento: this.editForm.get(['com_valordocumento'])!.value,
      comValorpagamento: this.editForm.get(['com_valorpagamento'])!.value,
      comObservacao: this.editForm.get(['com_observacao'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComprovante>>): void {
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
