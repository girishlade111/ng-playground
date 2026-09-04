import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import NavLayoutComponent from './shared/nav-layout/nav-layout.component';
import { HttpLogPanelComponent } from './shared/components/http-log-panel/http-log-panel.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet, NavLayoutComponent, HttpLogPanelComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly title = 'ng-playground';
}