import { Component } from '@angular/core';
import { AppLayoutService } from '../../../services/app.layout.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(public layoutService: AppLayoutService) {}
}
