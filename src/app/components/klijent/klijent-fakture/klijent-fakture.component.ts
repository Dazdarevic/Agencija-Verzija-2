import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin service/admin.service';
import { KlijentService } from '../../../services/klijent service/klijent.service';
import { ToastrService } from 'ngx-toastr';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from '../../../services/local storage service/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'klijent-fakture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './klijent-fakture.component.html',
  styleUrls: ['./klijent-fakture.component.css'] // Ispravi "styleUrl" na "styleUrls"
})
export class KlijentFaktureComponent implements OnInit {
  fakture: any[] = [];
  userId!: number;
  userRole!: string ;
  selectedFile: any | null = null;
  userInfo: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fakturaService: KlijentService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService // Dodaj LocalStorageService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.localStorageService.getItem('token'); // Koristi LocalStorageService

    if (token) {
      const decodedToken: any = jwt_decode(token);

      console.log(decodedToken);
      this.userId = decodedToken?.UserId;
      this.userRole = decodedToken?.UserRole;

      if (this.userId && this.userRole) {
        this.getFaktureZaKlijenta(this.userId);
      }
    }
    }
  }

  getFaktureZaKlijenta(id: number): void {
    this.fakturaService.getFaktureZaKlijenta(id)
      .subscribe(fakture => this.fakture = fakture);
  }
}
