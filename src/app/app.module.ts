import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ClarityModule } from '@clr/angular';
import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { PoolStatsService } from "app/services/pool-stats.service";
import { TopMinerStatsComponent } from "app/top-miner-stats/top-miner-stats.component";
import { WorkerLookupComponent } from "app/worker-lookup/worker-lookup.component";
import { PoolStatsComponent } from "app/pool-stats/pool-stats.component";
import { ChartsModule } from 'ng2-charts-x';
import { MinerStatsService } from "app/services/miner-stats.service";
import { NumKeysPipe, KeyValuePipe, SiPipe, HashRateScalePipe } from "app/services/various.pipe";

@NgModule({
    declarations: [
        AppComponent,
        TopMinerStatsComponent,
        WorkerLookupComponent,
        PoolStatsComponent,
        NumKeysPipe,
        KeyValuePipe,
        SiPipe,
        HashRateScalePipe
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        ClarityModule,
        ChartsModule,
        ROUTING,
    ],
    providers: [PoolStatsService, MinerStatsService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
