/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule } from '@angular/router';

import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { HomeComponent } from './home/home.component';
import { TopMinerStatsComponent } from "app/top-miner-stats/top-miner-stats.component";


export const ROUTES: Routes = [
    {path: '', redirectTo: 'pool-stats', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'pool-stats', component: PoolStatsComponent },
    {path: 'top-miners', component: TopMinerStatsComponent
    }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
