import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

export interface IStats {
  maxDate: Moment;
  periodo: string;
  quantidade: number;
  divergente: number;
}

export class StatsLine {
  constructor(
    public inteligentStats: IStats[],
    public parceiro: IParceiro,
    public lineChartData?: ChartDataSets[],
    public lineChartLabels?: Label[],
    public lineChartColors?: Color[],
    public lineChartLegend?: boolean,
    public lineChartPlugins?: any[],
    public lineChartOptions?: any
  ) {}
}

export class InteligentStatsUtil {
  static processData(statsLine: StatsLine) {
    if (statsLine.inteligentStats) {
      statsLine.lineChartLabels = [];
      statsLine.lineChartData = [];
      statsLine.lineChartPlugins = [];
      let _data = [];
      let _pointBackgroundColor = [];
      const _label = 'Inteligent';
      for (let index = statsLine.inteligentStats.length - 1; index > -1; index--) {
        const element = statsLine.inteligentStats[index];
        _data.push(element.quantidade);
        element.divergente > 0 ? _pointBackgroundColor.push('red') : _pointBackgroundColor.push('white');

        statsLine.lineChartLabels.push(element.maxDate.month() + 1 + '/' + element.maxDate.year());
      }
      statsLine.lineChartData.push({ data: _data, label: _label, pointBackgroundColor: _pointBackgroundColor });
      statsLine.lineChartColors = [
        {
          borderColor: 'rgba(255,255,255,.55)',
          backgroundColor: '#033C73',
        },
      ];
      statsLine.lineChartLegend = false;
      statsLine.lineChartOptions = {
        responsive: true,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent',
              },
              ticks: {
                fontColor: 'white',
              },
            },
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                display: false,
              },
            },
          ],
        },
        elements: {
          line: {
            tension: 0.00001,
            borderWidth: 1,
          },
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      };
    }
  }

  static processDataBar(statsLine: StatsLine) {
    if (statsLine.inteligentStats) {
      statsLine.lineChartLabels = [];
      statsLine.lineChartData = [];
      statsLine.lineChartPlugins = [];
      let _dataConciliado = [];
      let _dataDivergente = [];
      const _labelConcilado = 'Conciliados';
      const _labelDivergente = 'Divergentes';
      for (let index = statsLine.inteligentStats.length - 1; index > -1; index--) {
        const element = statsLine.inteligentStats[index];
        _dataConciliado.push(element.quantidade - element.divergente);
        _dataDivergente.push(element.divergente);
        statsLine.lineChartLabels.push(element.maxDate.month() + 1 + '/' + element.maxDate.year());
      }
      statsLine.lineChartData.push({ data: _dataConciliado, label: _labelConcilado, barThickness: 15, maxBarThickness: 15 });
      statsLine.lineChartData.push({ data: _dataDivergente, label: _labelDivergente, barThickness: 15, maxBarThickness: 15 });
      statsLine.lineChartColors = [
        {
          borderColor: 'rgba(255,255,255,.55)',
          backgroundColor: '#e9ecef',
        },
        {
          borderColor: 'rgba(255,255,255,.55)',
          backgroundColor: '#C71C22',
        },
      ];
      statsLine.lineChartLegend = false;
      statsLine.lineChartOptions = {
        scales: {
          xAxes: [
            {
              gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent',
              },
              stacked: true,
              ticks: {
                fontColor: 'white',
              },
            },
          ],
          yAxes: [{ display: false, stacked: true }],
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          },
        },
      };
    }
  }
}
