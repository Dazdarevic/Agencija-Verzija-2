import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { KlijentService } from '../../../services/klijent service/klijent.service';
import jwt_decode from 'jwt-decode';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'svereklame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svereklame.component.html',
  styleUrl: './svereklame.component.css'
})
export class SvereklameComponent {
  reklame: any[] = [];

  constructor(
    private klijentService: KlijentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: Router
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchReklame();
      this.izbrisiIstekleReklame();
    }
  }

  fetchReklame(): void {
    this.klijentService.getOdobreneReklame().subscribe(
      reklame => {
        this.reklame = reklame;
        console.log('Reklame za klijenta:', this.reklame);
      },
      error => {
        console.error('Greška prilikom dobijanja reklama:', error);
      }
    );
  }

  izbrisiIstekleReklame(): void {
    this.klijentService.deleteIstekleReklame().subscribe(
      () => {
        console.log('Istekle reklame su uspešno obrisane.');
      },
      (error) => {
        console.error('Greška pri brisanju isteklih reklama:', error);
      }
    );
  }
}
