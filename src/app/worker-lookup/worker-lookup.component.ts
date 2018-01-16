import { Component } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { MinerStatsService } from "app/services/miner-stats.service";
import { MinerLookup, MinerStats } from "app/models/miner-stats";
import { NumKeysPipe } from "app/services/numkeys.pipe"

@Component({
    styleUrls: ['./worker-lookup.component.scss'],
    templateUrl: './worker-lookup.component.html'
})
export class WorkerLookupComponent implements OnInit {
    lookupModel: MinerLookup;
    lookedUp: boolean;
    minerStats: MinerStats;

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
