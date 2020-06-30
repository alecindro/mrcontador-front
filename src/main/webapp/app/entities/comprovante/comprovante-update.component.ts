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
      par_codigo: comprovante.par_codigo,
      age_codigo: comprovante.age_codigo,
      com_cnpj: comprovante.com_cnpj,
      com_beneficiario: comprovante.com_beneficiario,
      com_documento: comprovante.com_documento,
      com_datavencimento: comprovante.com_datavencimento ? comprovante.com_datavencimento.format(DATE_TIME_FORMAT) : null,
      com_datapagamento: comprovante.com_datapagamento ? comprovante.com_datapagamento.format(DATE_TIME_FORMAT) : null,
      com_valordocumento: comprovante.com_valordocumento,
      com_valorpagamento: comprovante.com_valorpagamento,
      com_observacao: comprovante.com_observacao,
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
      par_codigo: this.editForm.get(['par_codigo'])!.value,
      age_codigo: this.editForm.get(['age_codigo'])!.value,
      com_cnpj: this.editForm.get(['com_cnpj'])!.value,
      com_beneficiario: this.editForm.get(['com_beneficiario'])!.value,
      com_documento: this.editForm.get(['com_documento'])!.value,
      com_datavencimento: this.editForm.get(['com_datavencimento'])!.value
        ? moment(this.editForm.get(['com_datavencimento'])!.value, DATE_TIME_FORMAT)
        : undefined,
      com_datapagamento: this.editForm.get(['com_datapagamento'])!.value
        ? moment(this.editForm.get(['com_datapagamento'])!.value, DATE_TIME_FORMAT)
        : undefined,
      com_valordocumento: this.editForm.get(['com_valordocumento'])!.value,
      com_valorpagamento: this.editForm.get(['com_valorpagamento'])!.value,
      com_observacao: this.editForm.get(['com_observacao'])!.value,
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
