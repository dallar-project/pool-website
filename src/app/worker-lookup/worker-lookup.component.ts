import { Component } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { MinerStatsService } from "app/services/miner-stats.service";
import { MinerLookup } from "app/models/miner-stats";

@Component({
    styleUrls: ['./worker-lookup.component.scss'],
    templateUrl: './worker-lookup.component.html',
})
export class WorkerLookupComponent implements OnInit {
    lookupModel: MinerLookup;
    lookedUp: boolean;

    constructor(private minerStatsService: MinerStatsService) {
        this.lookupModel = new MinerLookup('');
        this.lookedUp = false;
    }

    ngOnInit() {

    }

    isAddressValid(address: String):boolean {
        return true;
    }

    onSubmit() {
        if (this.isAddressValid(this.lookupModel.address)) {
            this.lookedUp = true;
        }
    }

}
