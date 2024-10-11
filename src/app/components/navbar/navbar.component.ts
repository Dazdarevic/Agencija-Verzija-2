import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importovanje CommonModule
import { LocalStorageService } from '../../services/local storage service/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  menuType: String = "default";
  isLoggedIn = false;
  user: any;
  role: String = "member";
  isDropdownOpen = false;

  constructor(private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorageService: LocalStorageService
  ) { }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.events.subscribe((val: any) => {
        if (val.url) {
          if (this.localStorageService.getItem('token')) {
            // console.log("ulogovan");

            // this.menuType = "admin";
            const token = this.localStorageService.getItem('token');
            if (token) {
              this.user = jwt_decode(token);
              this.role = this.user.UserRole;
              // console.log(this.menuType);
            }
            this.menuType = this.role;
            console.log(this.menuType);
          } else {
            this.menuType = "default";
          }
        }
      });
    }
  }

  logout(){
    this.localStorageService.removeItem("token");
    this.route.navigate(['/login']);
  }
}
