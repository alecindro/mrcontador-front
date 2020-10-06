import { Component, OnInit, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { IRegra, Regra } from 'app/model/regra.model';
import { RegraService } from 'app/services/regra.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IParceiro } from 'app/model/parceiro.model';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { JhiEventManager } from 'ng-jhipster';

@Component({
  selector: 'jhi-regra-update',
  templateUrl: './regra-update.component.html',
})
export class RegraUpdateComponent implements OnInit {
  editForm = this.fb.group({
    id: [],
    reg_descricao: [null, [Validators.maxLength(60)]],
    conta: {},
    reg_historico: [null, [Validators.maxLength(60)]],
    reg_todos: [null, [Validators.maxLength(1)]],
    aplicacao: [null, [Validators.required]],
  });
  @Input() public parceiro!: IParceiro;
  @Input() public regra!: IRegra;

  constructor(
    protected regraService: RegraService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    protected eventManager: JhiEventManager
  ) {}

  ngOnInit(): void {
    this.updateForm(this.regra);
  }

  updateForm(regra: IRegra): void {
    this.editForm.patchValue({
      id: regra.id,
      reg_descricao: regra.regDescricao,
      conta: regra?.conta,
      reg_historico: regra.regHistorico,
      reg_todos: regra.regTodos,
      aplicacao: regra.aplicacao,
    });
  }

  previousState(): void {
    this.activeModal.dismiss();
  }

  save(): void {
    this.spinner.show();
    const regra = this.createFromForm();
    regra.parceiro = this.parceiro;
    regra.dataCadastro = moment();
    if (regra.id !== undefined) {
      this.subscribeToSaveResponse(this.regraService.update(regra));
    } else {
      this.subscribeToSaveResponse(this.regraService.create(regra));
    }
  }

  private createFromForm(): IRegra {
    return {
      ...new Regra(),
      id: this.editForm.get(['id'])!.value,
      regDescricao: this.editForm.get(['reg_descricao'])!.value,
      conta: this.editForm.get(['conta'])!.value,
      regHistorico: this.editForm.get(['reg_historico'])!.value,
      regTodos: this.editForm.get(['reg_todos'])!.value,
      aplicacao: this.editForm.get(['aplicacao'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegra>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.spinner.hide();
    this.eventManager.broadcast('regraUpdate');
    this.activeModal.close();
  }

  protected onSaveError(): void {
    this.spinner.hide();
  }
}
