import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { INotafiscal, Notafiscal } from 'app/shared/model/notafiscal.model';
import { NotafiscalService } from './notafiscal.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

@Component({
  selector: 'jhi-notafiscal-update',
  templateUrl: './notafiscal-update.component.html',
})
export class NotafiscalUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    not_numero: [],
    not_descricao: [null, [Validators.maxLength(50)]],
    not_cnpj: [null, [Validators.maxLength(18)]],
    not_empresa: [null, [Validators.maxLength(60)]],
    not_datasaida: [],
    not_valornota: [],
    not_dataparcela: [],
    not_valorparcela: [],
    tno_codigo: [],
    not_parcela: [null, [Validators.maxLength(10)]],
  });

  constructor(
    protected notafiscalService: NotafiscalService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notafiscal }) => {
      if (!notafiscal.id) {
        const today = moment().startOf('day');
        notafiscal.not_datasaida = today;
        notafiscal.not_dataparcela = today;
      }

      this.updateForm(notafiscal);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(notafiscal: INotafiscal): void {
    this.editForm.patchValue({
      id: notafiscal.id,
      not_numero: notafiscal.notNumero,
      not_descricao: notafiscal.notDescricao,
      not_cnpj: notafiscal.notCnpj,
      not_empresa: notafiscal.notEmpresa,
      not_datasaida: notafiscal.notDatasaida ? notafiscal.notDatasaida.format(DATE_TIME_FORMAT) : null,
      not_valornota: notafiscal.notValornota,
      not_dataparcela: notafiscal.notDataparcela ? notafiscal.notDataparcela.format(DATE_TIME_FORMAT) : null,
      not_valorparcela: notafiscal.notValorparcela,
      tno_codigo: notafiscal.tnoCodigo,
      not_parcela: notafiscal.notParcela,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notafiscal = this.createFromForm();
    if (notafiscal.id !== undefined) {
      this.subscribeToSaveResponse(this.notafiscalService.update(notafiscal));
    } else {
      this.subscribeToSaveResponse(this.notafiscalService.create(notafiscal));
    }
  }

  private createFromForm(): INotafiscal {
    return {
      ...new Notafiscal(),
      id: this.editForm.get(['id'])!.value,
      notNumero: this.editForm.get(['not_numero'])!.value,
      notDescricao: this.editForm.get(['not_descricao'])!.value,
      notCnpj: this.editForm.get(['not_cnpj'])!.value,
      notEmpresa: this.editForm.get(['not_empresa'])!.value,
      notDatasaida: this.editForm.get(['not_datasaida'])!.value
        ? moment(this.editForm.get(['not_datasaida'])!.value, DATE_TIME_FORMAT)
        : undefined,
      notValornota: this.editForm.get(['not_valornota'])!.value,
      notDataparcela: this.editForm.get(['not_dataparcela'])!.value
        ? moment(this.editForm.get(['not_dataparcela'])!.value, DATE_TIME_FORMAT)
        : undefined,
      notValorparcela: this.editForm.get(['not_valorparcela'])!.value,
      tnoCodigo: this.editForm.get(['tno_codigo'])!.value,
      notParcela: this.editForm.get(['not_parcela'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotafiscal>>): void {
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
