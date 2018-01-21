import { Component } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { MinerStatsService } from "app/services/miner-stats.service";
import { MinerLookup, MinerStats } from "app/models/miner-stats";
import { NumKeysPipe, KeyValuePipe, SiPipe, HashRateScalePipe } from "app/services/various.pipe"
import * as moment from 'moment';

@Component({
    styleUrls: ['./worker-lookup.component.scss'],
    templateUrl: './worker-lookup.component.html'
})
export class WorkerLookupComponent implements OnInit {
    lookupModel: MinerLookup;
    lookedUp: boolean;
    minerStats: MinerStats;
    validAddress: string;

    workerChartData:Array<any> = [
        {data: []},
    ];

    chartLabels:Array<string>;

    chartOptions:any = {
        responsive: true
    }

    hashrateChartOptions:any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return SiPipe.prototype.transform(value, 1, "H/s");
                    }
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, chart) => {
                    return SiPipe.prototype.transform(this.workerChartData[tooltipItem.datasetIndex].data[tooltipItem.index], 6, "H/s");
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
        return address.length === 34 && address.substring(0,1) === 'D'; 
    }

    onSubmit() {
        if (this.isAddressValid(this.lookupModel.address)) {
            this.validAddress = this.lookupModel.address;
            this.minerStatsService.getMinerStats(this.lookupModel.address).subscribe(p=>{
                this.minerStats = p;
                if (p.performance24H == []) {
                    //@TODO: Handle failed lookup
                    return;
                }

                let workerNames:Array<string> = [];

                //Get all worker names
                p.performance24H.forEach(perf=> {
                    let names = Object.keys(perf.workers);
                    names.forEach(name=> {
                        if (workerNames.indexOf(name) === -1) workerNames.push(name);
                    });
                });

                //Build worker graph data points
                //@TODO: I feel like theres a much better and sane way to do this
                let workerHashData:Array<any> = [];
                workerNames.forEach(worker=>workerHashData.push({data: [], label: worker}));

                this.chartLabels = [];

                p.performance24H.forEach((perf, perfIndex)=> {
                    this.chartLabels.push(moment(perf.created).format('HH:MM'));
                    let names = Object.keys(perf.workers);
                    names.forEach(name=> {
                        let index = workerNames.indexOf(name);
                        if (index === -1) return;
                        workerHashData[index].data.push(HashRateScalePipe.prototype.transform(perf.workers[name].hashrate));
                    });
                    //Make sure we have a data point for every charted worker
                    //If we don't have a data point, use 0
                    workerHashData.forEach((worker, workerIndex)=> {
                        if (worker.data.length <= perfIndex) worker.data.push(0);
                    })
                });

                workerHashData.forEach((worker)=>{if (worker.label === '') worker.label = 'Untitled'});
                this.workerChartData = workerHashData;

                // Display worker stats
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
