import { Component, OnInit } from '@angular/core';
import { IAgenciabancaria } from '../../../model/agenciabancaria.model';
import { AgenciabancariaService } from '../../../services/agenciabancaria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IParceiro } from '../../../model/parceiro.model';
import { ParceiroService } from '../../../services/parceiro.service';
import { TipoAgencia } from '../../../shared/constants/TipoAgencia';
import { IConta } from '../../../model/conta.model';

@Component({
  selector: 'jhi-caixa',
  templateUrl: './caixa.component.html',
})
export class CaixaComponent implements OnInit {
  caixa!: IAgenciabancaria;
  parceiro!: IParceiro;
  editable = true;
  contaSelected?: IConta;

  constructor(
    protected agenciabancariaService: AgenciabancariaService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService
  ) {}

  loadCaixa(): void {
    const queryParam = {
      'tipoAgencia.equals': TipoAgencia[TipoAgencia.CAIXA],
      'parceiroId.equals': this.parceiro.id,
    };
    this.agenciabancariaService.query(queryParam).subscribe(
      (res: HttpResponse<IAgenciabancaria[]>) => this.onSuccess(res.body),
      () => this.onError()
    );
  }
  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.loadCaixa();
  }
  protected onError(): void {}
  protected onSuccess(data: IAgenciabancaria[] | null): void {
    this.caixa = {};
    if (data && data.length > 0) {
      this.editable = false;
      this.caixa = data[0];
    }
  }
  public edit(): void {
    this.editable = true;
  }
  selectedConta(conta: IConta): void {
    this.contaSelected = conta;
  }
  cancel(): void {
    this.editable = false;
  }
  save(): void {
    this.caixa.ageSituacao = true;
    this.caixa.conta = this.contaSelected;
    this.agenciabancariaService.update(this.caixa).subscribe(() => {
      this.editable = false;
    });
  }
}
