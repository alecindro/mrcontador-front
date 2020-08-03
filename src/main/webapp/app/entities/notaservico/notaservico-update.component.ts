import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { INotaservico, Notaservico } from 'app/shared/model/notaservico.model';
import { NotaservicoService } from './notaservico.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

@Component({
  selector: 'jhi-notaservico-update',
  templateUrl: './notaservico-update.component.html',
})
export class NotaservicoUpdateComponent implements OnInit {
  isSaving = false;
  parceiros: IParceiro[] = [];

  editForm = this.fb.group({
    id: [],
    nse_numero: [],
    nse_descricao: [null, [Validators.maxLength(50)]],
    nse_cnpj: [null, [Validators.maxLength(18)]],
    nse_empresa: [null, [Validators.maxLength(60)]],
    nse_datasaida: [],
    nse_valornota: [],
    nse_dataparcela: [],
    nse_valorparcela: [],
    tno_codigo: [],
    nse_parcela: [null, [Validators.maxLength(10)]],
    parceiroId: [null, Validators.required],
  });

  constructor(
    protected notaservicoService: NotaservicoService,
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notaservico }) => {
      if (!notaservico.id) {
        const today = moment().startOf('day');
        notaservico.nse_datasaida = today;
        notaservico.nse_dataparcela = today;
      }

      this.updateForm(notaservico);

      this.parceiroService.query().subscribe((res: HttpResponse<IParceiro[]>) => (this.parceiros = res.body || []));
    });
  }

  updateForm(notaservico: INotaservico): void {
    this.editForm.patchValue({
      id: notaservico.id,
      nse_numero: notaservico.nseNumero,
      nse_descricao: notaservico.nseDescricao,
      nse_cnpj: notaservico.nseCnpj,
      nse_empresa: notaservico.nseEmpresa,
      nse_datasaida: notaservico.nseDatasaida ? notaservico.nseDatasaida.format(DATE_TIME_FORMAT) : null,
      nse_valornota: notaservico.nseValornota,
      nse_dataparcela: notaservico.nseDataparcela ? notaservico.nseDataparcela.format(DATE_TIME_FORMAT) : null,
      nse_valorparcela: notaservico.nseValorparcela,
      tno_codigo: notaservico.tnoCodigo,
      nse_parcela: notaservico.nseParcela,
      parceiroId: notaservico.parceiro,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notaservico = this.createFromForm();
    if (notaservico.id !== undefined) {
      this.subscribeToSaveResponse(this.notaservicoService.update(notaservico));
    } else {
      this.subscribeToSaveResponse(this.notaservicoService.create(notaservico));
    }
  }

  private createFromForm(): INotaservico {
    return {
      ...new Notaservico(),
      id: this.editForm.get(['id'])!.value,
      nseNumero: this.editForm.get(['nse_numero'])!.value,
      nseDescricao: this.editForm.get(['nse_descricao'])!.value,
      nseCnpj: this.editForm.get(['nse_cnpj'])!.value,
      nseEmpresa: this.editForm.get(['nse_empresa'])!.value,
      nseDatasaida: this.editForm.get(['nse_datasaida'])!.value
        ? moment(this.editForm.get(['nse_datasaida'])!.value, DATE_TIME_FORMAT)
        : undefined,
      nseValornota: this.editForm.get(['nse_valornota'])!.value,
      nseDataparcela: this.editForm.get(['nse_dataparcela'])!.value
        ? moment(this.editForm.get(['nse_dataparcela'])!.value, DATE_TIME_FORMAT)
        : undefined,
      nseValorparcela: this.editForm.get(['nse_valorparcela'])!.value,
      tnoCodigo: this.editForm.get(['tno_codigo'])!.value,
      nseParcela: this.editForm.get(['nse_parcela'])!.value,
      parceiro: this.editForm.get(['parceiroId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotaservico>>): void {
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
