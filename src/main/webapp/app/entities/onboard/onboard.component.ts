import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ParceiroService } from '../../services/parceiro.service';
import { IParceiro } from 'app/model/parceiro.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { Subscription, Subject, Observable, merge } from 'rxjs';
import { AgenciabancariaService } from '../../services/agenciabancaria.service';
import { IAgenciabancaria } from 'app/model/agenciabancaria.model';
import { HttpResponse } from '@angular/common/http';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ContaService } from 'app/services/conta.service';

@Component({
  selector: 'jhi-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
})
export class OnboardComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  isCadastro = true;
  isImportacao = true;
  isMenu = false;

  parceiro!: IParceiro;
  parceiros!: IParceiro[];
  agenciaListener!: Subscription;
  contaListener!: Subscription;
  hasAgencia = false;
  hasConta = false;
  constructor(
    public parceiroService: ParceiroService,
    public activatedRoute: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public eventManager: JhiEventManager,
    protected router: Router,
    protected agenciabancariaService: AgenciabancariaService,
    protected contaService: ContaService
  ) {
    this.agenciaListener = eventManager.subscribe('agenciasaved', () => {
      this.loadAgencias(this.parceiro);
    });
    this.contaListener = eventManager.subscribe('contasaved', () => {
      this.hasConta = true;
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      this.parceiro = parceiro;
      this.eventManager.broadcast(new JhiEventWithContent('parceiroSelected', parceiro));
      this.parceiroService.setParceiroSelected(parceiro);
      this.loadAgencias(parceiro);
      this.searchConta(parceiro);
      this.parceiroService.get().subscribe(response => {
        this.parceiros = response.body || [parceiro];
        this.spinner.hide();
      });
    });
  }

  private searchConta(parceiro: IParceiro): void {
    const param = { 'parceiroId.equals': parceiro?.id };
    this.contaService.query(param).subscribe(response => {
      if (response.body && response.body.length > 0) {
        this.hasConta = true;
      }
    });
  }

  private loadParceiro(parceiro: IParceiro): void {
    this.parceiro = parceiro;
    if (this.parceiro.agenciabancarias) {
      const value = this.parceiro.agenciabancarias.find(agencia => {
        return agencia.ageSituacao === true;
      });
      this.hasAgencia = value?.ageSituacao || false;
    } else {
      this.hasAgencia = false;
    }
    this.parceiroService.setParceiroSelected(parceiro);
    this.eventManager.broadcast(new JhiEventWithContent('parceiroSelected', parceiro));
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.agenciaListener);
    this.eventManager.destroy(this.contaListener);
  }
  onChangeParceiro(event: NgbTypeaheadSelectItemEvent): void {
    this.loadParceiro(event.item);
    this.searchConta(event.item);
    this.router.navigate([`/onboard/${this.parceiro.id}`]);
  }

  private loadAgencias(parceiro: IParceiro): void {
    const queryParam = {
      'parceiroId.equals': parceiro.id,
    };
    this.agenciabancariaService.query(queryParam).subscribe((res: HttpResponse<IAgenciabancaria[]>) => {
      parceiro.agenciabancarias = res.body || [];
      this.loadParceiro(parceiro);
    });
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term =>
        term.trim() === ''
          ? this.parceiros
          : this.parceiros
              .filter(v => (v.parRazaosocial ? v.parRazaosocial.toLowerCase().indexOf(term.toLowerCase()) > -1 : ''))
              .slice(0, 10)
      )
    );
  };

  formatter = (x: { parRazaosocial: string }) => x.parRazaosocial;

  resultFormatter = (x: { parRazaosocial: string }) => x.parRazaosocial;
}
