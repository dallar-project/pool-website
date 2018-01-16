import { Component } from "@angular/core";
import { PoolStatsService } from "app/services/pool-stats.service";
import { Observable } from "rxjs/Observable";
import { PoolStats } from "app/models/pool-stats";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { IPoolPerformanceStat } from "app/models/ipoolperformancestat";
import * as moment from 'moment';

@Component({
    templateUrl: './pool-stats.component.html',
})

export class PoolStatsComponent implements OnInit {
    poolStats: PoolStats;
    poolPerformanceStats: IPoolPerformanceStat[];

    minerChartData:Array<any> = [
        {data: []},
    ];

    hashrateChartData:Array<any> = [
        {data: []},
    ];

    hashrateScale(value:Number, index:Number, values:any): String {
        return PoolStatsService.toSI(value, 0, 'H/s');
    }

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
                        return PoolStatsService.toSI(value, 1, "H/s");
                    }
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, chart) => {
                    return PoolStatsService.toSI(this.hashrateChartData[0].data[tooltipItem.index], 6, "H/s");
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
            this.poolPerformanceStats.forEach((stat, index)=> {
                minerData.push(stat.connectedMiners);
                hashrateData.push(stat.poolHashRate)
                this.chartLabels.push(moment(stat.created).format('HH:MM'));
            })
            
            this.minerChartData = [{data: minerData, label: "Miners"}];
            this.hashrateChartData = [{data: hashrateData, label: "Hash Rate"}];            
        });
    }
}
