import { Component } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { MinerStatsService } from "app/services/miner-stats.service";
import { MinerLookup, MinerStats } from "app/models/miner-stats";
import { NumKeysPipe, KeyValuePipe, SiPipe } from "app/services/various.pipe"

@Component({
    styleUrls: ['./worker-lookup.component.scss'],
    templateUrl: './worker-lookup.component.html'
})
export class WorkerLookupComponent implements OnInit {
    lookupModel: MinerLookup;
    lookedUp: boolean;
    minerStats: MinerStats;

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

    constructor(private minerStatsService: MinerStatsService) {
        this.lookupModel = new MinerLookup('');
        this.lookedUp = false;
        this.minerStats = MinerStats.fromEmpty();
    }

    ngOnInit() {

    }

    isAddressValid(address: String):boolean {
        return true;
    }

    onSubmit() {
        if (this.isAddressValid(this.lookupModel.address)) {
            this.minerStatsService.getMinerStats(this.lookupModel.address).subscribe(p=>{
                this.minerStats = p;
                if (p.performance24H == []) {
                    //@TODO: Handle failed lookup
                    return;
                }



                this.lookedUp = true;
            });
        }
    }

    onResetSubmit() {
        this.lookedUp = false;
        this.lookupModel = new MinerLookup('');
        this.minerStats = MinerStats.fromEmpty();
    }
}
