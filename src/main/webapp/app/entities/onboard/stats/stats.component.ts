import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { ParceiroService } from '../../../services/parceiro.service';
import { IParceiro } from '../../../model/parceiro.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { StatsService } from 'app/services/stats.service';
import { StatsDTO } from 'app/shared/dto/statsDTO';
import { HttpResponse } from '@angular/common/http';
import { InteligentStatsUtil, StatsLine } from 'app/model/inteligentStats.model';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  parceiro?: IParceiro;
  stastsDTO: StatsDTO = {};
  statsInteligent: StatsLine = new StatsLine([], {});
  statsExtrato: StatsLine = new StatsLine([], {});
  statsComprovante: StatsLine = new StatsLine([], {});
  statsNF: StatsLine = new StatsLine([], {});
  bgInteligent = 'card text-white bg-info';
  bgComprovante = 'card text-white bg-info';
  bgExtrato = 'card text-white bg-info';
  bgNf = 'card text-white bg-info';

  constructor(
    private eventManager: JhiEventManager,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    private $localStorage: LocalStorageService,
    private statsService: StatsService,
    protected router: Router
  ) {
    this.registerParceiroListener();
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.loadStats();
  }
  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
  }

  loadStats(): void {
    if (this.parceiro && this.parceiro.id) {
      this.spinner.show();
      this.statsService.get(this.parceiro.id).subscribe(
        (res: HttpResponse<StatsDTO>) => {
          this.stastsDTO = res.body || {};
          this.statsInteligent.inteligentStats = this.stastsDTO.inteligentStats || [];
          InteligentStatsUtil.processDataBar(this.statsInteligent);
          this.statsComprovante.inteligentStats = this.stastsDTO.comprovanteStats || [];
          InteligentStatsUtil.processDataBar(this.statsComprovante);
          this.statsExtrato.inteligentStats = this.stastsDTO.extratoStats || [];
          InteligentStatsUtil.processDataBar(this.statsExtrato);
          this.statsNF.inteligentStats = this.stastsDTO.nfsStats || [];
          InteligentStatsUtil.processDataBar(this.statsNF);
          this.defineCss();
          this.spinner.hide();
        },
        () => this.onError()
      );
    }
  }

  private defineCss() {
    if (this.stastsDTO.inteligentStats) {
      const divergentes = this.stastsDTO.inteligentStats.find(i => i.divergente > 0);
      if (divergentes) {
        this.bgInteligent = 'card text-white bg-warning';
      }
    }
    if (this.stastsDTO.comprovanteStats) {
      const divergentes = this.stastsDTO.comprovanteStats.find(i => i.divergente > 0);
      if (divergentes) {
        this.bgComprovante = 'card text-white bg-warning';
      }
    }
    if (this.stastsDTO.extratoStats) {
      const divergentes = this.stastsDTO.extratoStats.find(i => i.divergente > 0);
      if (divergentes) {
        this.bgExtrato = 'card text-white bg-warning';
      }
    }

    if (this.stastsDTO.nfsStats) {
      const divergentes = this.stastsDTO.nfsStats.find(i => i.divergente > 0);
      if (divergentes) {
        this.bgNf = 'card text-white bg-warning';
      }
    }
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', () => {
      this.parceiro = this.parceiroService.getParceiroSelected();
      this.loadStats();
    });
  }

  protected onError(): void {
    this.spinner.hide();
  }

  public chartHover($event: any): void {
    console.log($event);
  }

  public inteligentClicked($e: any): void {
    this.go($e, '/onboard/consolida');
  }

  public extratoClicked($e: any): void {
    this.go($e, '/onboard/extrato');
  }

  public comprovanteClicked($e: any): void {
    this.go($e, '/onboard/comprovante');
  }

  public nfClicked($e: any): void {
    this.go($e, '/onboard/nfe');
  }

  private go($e: any, url: string): void {
    if ($e.active.length > 0) {
      const chart = $e.active[0]._chart;
      const activePoints = chart.getElementAtEvent($e.event);
      if (activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        this.$localStorage.store('periodo', label.replace('/', ''));
        this.router.navigateByUrl(url);
      }
    }
  }
}
