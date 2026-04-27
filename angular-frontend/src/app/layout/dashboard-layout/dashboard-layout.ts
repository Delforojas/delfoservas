import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../shared/components/header.component';

import { AsideProfesorComponent } from '../../shared/components/aside-profesor.component';

import { FooterComponent } from '../../shared/components/footer.compomonent';

@Component({

  selector: 'app-dashboard-layout',

  standalone: true,

  imports: [

    RouterOutlet,

    HeaderComponent,

    AsideProfesorComponent,

    FooterComponent

  ],

  templateUrl: './dashboard-layout.html',

  styleUrl: './dashboard-layout.css'

})

export class DashboardLayoutComponent {}