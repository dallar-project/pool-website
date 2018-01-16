import { Component } from "@angular/core";
import { PoolStatsService } from "app/services/pool-stats.service";
import { Observable } from "rxjs/Observable";
import { PoolStats } from "app/models/pool-stats";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { IPoolPerformanceStat } from "app/models/ipoolperformancestat";
import { SiPipe } from "app/services/various.pipe";
import * as moment from 'moment';

@Component({
    templateUrl: './pool-stats.component.html',
})

export class PoolStatsComponent implements OnInit {
    poolStats: PoolStats;
    poolPerformanceStats: IPoolPerformanceStat[];
    peakMiners: Number;
    peakHashRate: String;
    avgMiners: Number;
    avgHashRate: String;

    minerChartData:Array<any> = [
        {data: []},
    ];

    hashrateChartData:Array<any> = [
        {data: []},
    ];

    lineChartColors:Array<any> = [
        { // dallar red
          backgroundColor: 'rgba(195,20,39,0.5)',
          borderColor: 'rgba(195,20,39,1)',
          pointBackgroundColor: 'rgba(195,20,39,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(195,20,39,0.8)'
        }
    ]

    chartLabels:Array<string> = [];

    chartOptions:any = {
        responsive: true
    }

    hashrateChartOptions:any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return SiPipe.prototype.transform(value, 1, "H/s");
                    }
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, chart) => {
                    return SiPipe.prototype.transform(this.hashrateChartData[0].data[tooltipItem.index], 6, "H/s");
                }
            }
        }
    };

    constructor(private poolStatsService: PoolStatsService) {
        this.poolStats = PoolStats.fromEmpty();
        this.poolPerformanceStats = [];
    }

    ngOnInit() {
        this.poolStatsService.getPoolStats().subscribe(p=>this.poolStats=p);
        this.poolStatsService.getPoolPerformance().subscribe(p=> {
            this.poolPerformanceStats=p;
            let minerData = [];
            let hashrateData = [];
            let labels:Array<string> = [];
            let minerPeak = 0;
            let hashPeak = 0;
            let minerSum = 0;
            let hashSum = 0;
            this.poolPerformanceStats.forEach((stat, index)=> {

                // Build chart data
                minerData.push(stat.connectedMiners);
                hashrateData.push(stat.poolHashRate)
                this.chartLabels.push(moment(stat.created).format('HH:MM'));

                // Get peaks
                if (stat.connectedMiners > minerPeak) minerPeak = stat.connectedMiners;
                if (stat.poolHashRate > hashPeak) hashPeak = stat.poolHashRate;

                // Build sums for averaging
                minerSum += stat.connectedMiners;
                hashSum += stat.poolHashRate;
            })

            // Update chart data
            this.minerChartData = [{data: minerData, label: "Miners"}];
            this.hashrateChartData = [{data: hashrateData, label: "Hash Rate"}];

            // Update peaks
            this.peakMiners = minerPeak;
            this.peakHashRate = SiPipe.prototype.transform(hashPeak, 6, 'H/s');

            // Update sums
            this.avgMiners = Math.floor(minerSum / this.poolPerformanceStats.length);
            this.avgHashRate = SiPipe.prototype.transform(hashSum / this.poolPerformanceStats.length, 6, 'H/s');
        });
    }
}
