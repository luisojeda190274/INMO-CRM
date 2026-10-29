import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { WelcomeTourComponent } from '../../features/welcome/welcome-tour.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SidebarComponent, 
    HeaderComponent, 
    WelcomeTourComponent
  ],
  template: `
    <div class="flex h-full w-full overflow-hidden bg-slate-50 font-sans selection:bg-teal-500 selection:text-white">
      <!-- Left Sidebar Navigation -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <!-- Top Application Header -->
        <app-header></app-header>

        <!-- Dynamic Routed View -->
        <main class="flex-1 overflow-y-auto bg-slate-50">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Welcome Onboarding Assistant Modal -->
      <app-welcome-tour></app-welcome-tour>
    </div>
  `
})
export class MainLayoutComponent {}
