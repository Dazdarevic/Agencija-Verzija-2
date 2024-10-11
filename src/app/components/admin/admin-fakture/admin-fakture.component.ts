import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin service/admin.service';
import { ToastrService } from 'ngx-toastr';
import jwt_decode from 'jwt-decode';
import { KlijentService } from '../../../services/klijent service/klijent.service';
import { LocalStorageService } from '../../../services/local storage service/local-storage.service';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'admin-fakture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-fakture.component.html',
  styleUrl: './admin-fakture.component.css'
})
export class AdminFaktureComponent implements OnInit{
  fakture!: any[];
  userId!: number;
  userRole!: string;
  selectedFile: any | null = null;
  userInfo: any;

  // Injektuj LocalStorageService
  constructor(
    private fakturaService: AdminService,
    private faktureKlijent: KlijentService,
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.localStorageService.getItem('token');

    if (token) {
      const decodedToken: any = jwt_decode(token);

      console.log(decodedToken);
      this.userId = decodedToken?.UserId;
      this.userRole = decodedToken?.UserRole;

      if (this.userId && this.userRole) {
        this.getFaktureZaAdmina(this.userId);
      }
    }
    }
  }

  getFaktureZaAdmina(id: number): void {
    this.faktureKlijent.getFaktureZaAdmina(id)
      .subscribe(fakture => this.fakture = fakture);
  }
}
