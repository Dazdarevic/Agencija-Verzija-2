import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { KlijentService } from '../../../services/klijent service/klijent.service';
import jwt_decode from 'jwt-decode';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../../services/local storage service/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'moje-reklame',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './moje-reklame.component.html',
  styleUrls: ['./moje-reklame.component.css'] // Ispravi "styleUrl" na "styleUrls"
})
export class MojeReklameComponent implements OnInit {
  reklame: any[] = [];
  userId: any;

  constructor(
    private datePipe: DatePipe,
    private klijentService: KlijentService,
    private route: Router,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorageService: LocalStorageService // Dodaj LocalStorageService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchReklame();
      this.izbrisiIstekleReklame();
    }
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

  deleteReklama(id: number) {
    this.klijentService.deleteReklama(id).subscribe(
      () => {
        this.fetchReklame();
        console.log('Reklama uspešno obrisana.');
        this.toastr.success('', 'Uspesno ste izbrisali reklamu!');
      },
      (error) => {
        this.fetchReklame();
        console.error('Došlo je do greške prilikom brisanja reklame:', error);
        this.toastr.error('Reklama je već odobrena i nemoguće je izbrisati.', 'Neuspesno brisanje reklame!');
      }
    );
  }

  fetchReklame(): void {
    const token = this.localStorageService.getItem('token'); // Koristi LocalStorageService

    if (token) {
      const decodedToken: any = jwt_decode(token);

      console.log(decodedToken);
      this.userId = decodedToken?.UserId;
    }

    this.klijentService.getReklameByKlijentId(this.userId).subscribe(
      reklame => {
        this.reklame = reklame;
        console.log('Reklame za klijenta:', this.reklame);
      },
      error => {
        console.error('Greška prilikom dobijanja reklama:', error);
      }
    );
  }
}
