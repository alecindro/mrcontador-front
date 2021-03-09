import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { NotafiscalService } from '../../../services/notafiscal.service';
import { IInteligent } from '../../../model/inteligent.model';
import { TipoValor } from '../../../shared/constants/TipoValor.constants';
import { TipoComprovante } from '../../../shared/constants/TipoComprovante.constants';
import { INotafiscal } from '../../../model/notafiscal.model';

@Component({
  templateUrl: './nf-dialog.component.html',
})
export class NfDialogComponent implements OnInit {
  notafiscals: {
    notafiscal: INotafiscal;
    selected: boolean;
  }[] = [];
  inteligent: IInteligent = {};

  constructor(public activeModal: NgbActiveModal, protected eventManager: JhiEventManager, private notaFiscalService: NotafiscalService) {}

  ngOnInit(): void {
    this.loadNotas(this.inteligent);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  public loadNotas(inteligent: IInteligent): void {
    if (
      inteligent.tipoValor === TipoValor[TipoValor.PRINCIPAL] &&
      inteligent?.comprovante &&
      inteligent.comprovante?.tipoComprovante === TipoComprovante[TipoComprovante.TITULO]
    ) {
      const queryParam = {
        'processado.equals': false,
        'notCnpj.contains': `${inteligent?.cnpj}`.substring(0, 8),
        'notDataparcela.lessThanOrEqual': inteligent?.datalancamento ? inteligent?.datalancamento.format('YYYY-MM-DD') : '',
      };
      this.notaFiscalService.query(queryParam).subscribe(response => {
        const nfs = response.body || [];
        for (var item in nfs) {
          const _nf = { notafiscal: nfs[item], selected: false };
          this.notafiscals.push(_nf);
        }
      });
    }
  }
}
