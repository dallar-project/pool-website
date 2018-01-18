/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule } from '@angular/router';

import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { TopMinerStatsComponent } from "app/top-miner-stats/top-miner-stats.component";
import { WorkerLookupComponent } from 'app/worker-lookup/worker-lookup.component';


export const ROUTES: Routes = [
    {path: '', redirectTo: 'pool-stats', pathMatch: 'full'},
    {path: 'pool-stats', component: PoolStatsComponent },
    {path: 'worker-lookup', component: WorkerLookupComponent },
    {path: 'top-miners', component: TopMinerStatsComponent },
    { path: '**', redirectTo: 'pool-stats', pathMatch: 'full' }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
