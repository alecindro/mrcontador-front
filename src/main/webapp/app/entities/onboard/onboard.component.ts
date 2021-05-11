import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ParceiroService } from '../../services/parceiro.service';
import { IParceiro } from '../../model/parceiro.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Observable, merge } from 'rxjs';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { LocalStorageService } from 'ngx-webstorage';

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

  constructor(
    public parceiroService: ParceiroService,
    public activatedRoute: ActivatedRoute,
    public spinner: NgxSpinnerService,
    protected router: Router,
    public eventManager: JhiEventManager,
    private $localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.eventManager.broadcast('parceiroSelected');
    this.parceiroService.get().subscribe(response => {
      this.parceiros = response.body || [this.parceiro];
      this.spinner.hide();
    });
  }

  private loadParceiro(parceiro: IParceiro): void {
    this.parceiro = parceiro;
    this.parceiroService.setParceiroSelected(parceiro);
    this.eventManager.broadcast('parceiroSelected');
  }

  ngOnDestroy(): void {}

  onChangeParceiro(event: NgbTypeaheadSelectItemEvent): void {
    this.loadParceiro(event.item);
    this.router.navigate(['/onboard']);
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
