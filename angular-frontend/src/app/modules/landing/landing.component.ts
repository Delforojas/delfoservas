import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "@shared/components/header.component";
import { AsideProfesorComponent } from "@shared/components/aside-profesor.component";
import { FooterComponent } from "@shared/components/footer.compomonent";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, HeaderComponent, AsideProfesorComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
