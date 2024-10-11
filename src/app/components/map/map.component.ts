import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin service/admin.service';

// Deklarišemo globalni window objekat
declare global {
  interface Window {
    L: any;
  }
}

@Component({
  selector: 'map',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private L: any;

  selectedGrad: string = "Novi Pazar";
  selectedPanoInfo: string = '';
  selectedPanoZone: string = '';
  selectedImg: string = 'https://www.w3schools.com/w3images/lights.jpg';

  constructor(private adminService: AdminService) { }

  ngAfterViewInit(): void {
    // Proveravamo da li window postoji
    if (typeof window !== 'undefined' && window.L) {
      this.initMap();
    } else {
      console.error('Leaflet nije dostupan ili window objekat ne postoji.');
    }
  }

  private initMap(): void {
    this.L = window.L; // Koristimo globalni L objekat
    if (!this.L) {
      console.error('Leaflet nije učitan.');
      return;
    }

    const coordinates = this.getGradCoordinates();

    this.map = this.L.map('map', {
      center: [coordinates.lat, coordinates.lng],
      zoom: 15
    });

    this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.addLegend();
    this.getReklamniPanoi();
  }

  private getGradCoordinates(): { lat: number, lng: number } {
    switch (this.selectedGrad) {
      case "Tutin":
        return { lat: 42.990733, lng: 20.337853 };
      case "Novi Pazar":
      default:
        return { lat: 43.1367, lng: 20.5122 };
    }
  }

  onGradChange(): void {
    if (!this.map) return;
    const coordinates = this.getGradCoordinates();
    this.map.setView([coordinates.lat, coordinates.lng], 15);
    this.getReklamniPanoi();
    this.selectedImg = 'https://www.w3schools.com/w3images/lights.jpg';
    this.selectedPanoInfo = '';
    this.selectedPanoZone = '';
  }

  private getReklamniPanoi(): void {
    this.adminService.getReklamniPanoiIzGrada(this.selectedGrad).subscribe(
      (data) => {
        console.log('Podaci:', data);
        this.addMarkers(data);
      },
      (error) => {
        console.error('Greška pri uzimanju podataka:', error);
      }
    );
  }

  private addMarkers(data: any[]): void {
    if (!this.L || !this.map) return;

    this.map.eachLayer((layer: any) => {
      if (layer instanceof this.L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    data.forEach(pano => {
      const latitude = parseFloat(pano.latitude);
      const longitude = parseFloat(pano.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error('Nevalidne koordinate za pano:', pano);
        return;
      }

      const title = `${pano.adresa}, Osvetljenost: ${pano.osvetljenost}, Cena: ${pano.cijena} RSD`;
      const zona = `${pano.grad} - ${pano.zona}`;
      const slika = `${pano.urlSlike}`;

      const cijena = parseFloat(pano.cijena);
      let iconColor = cijena > 2000 ? 'red' : cijena > 1000 ? 'orange' : 'green';

      const icon = this.L.icon({
        iconUrl: `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="${iconColor}" viewBox="0 0 20 20"><path d="M10 0C7.79 0 6 1.79 6 4c0 3.33 4 7 4 7s4-3.67 4-7c0-2.21-1.79-4-4-4zm0 15c-3.33 0-6 2.67-6 6 0 1.35 1.07 2.4 2.4 2.4h7.2C16.93 23 18 21.95 18 20.6c0-3.33-2.67-6-6-6z"/></svg>`,
        iconSize: [20, 20]
      });

      this.L.marker([latitude, longitude], { icon })
        .addTo(this.map)
        .bindPopup(title)
        .on('click', () => {
          this.selectedPanoInfo = title;
          this.selectedPanoZone = zona;
          this.selectedImg = slika;
        });
    });
  }

  private addLegend(): void {
    if (!this.L || !this.map) return;

    const legend = this.L.control({ position: 'topright' });

    legend.onAdd = () => {
      const div = this.L.DomUtil.create('div', 'info legend');
      const colors = ['red', 'orange', 'green'];
      const labels = [
        '<span style="color:red;">Najskuplje lokacije</span>',
        '<span style="color:orange;">Srednje skupe lokacije</span>',
        '<span style="color:green;">Jeftine lokacije</span>'
      ];

      div.innerHTML = '<h4 style="margin: 0;">Legenda</h4>';
      div.style.cssText = 'background-color: white; padding: 10px; border-radius: 5px; border: 2px solid rgba(0, 0, 0, 0.5);';

      colors.forEach((color, index) => {
        div.innerHTML += `<i style="background:${color};"></i> ${labels[index]}<br>`;
      });

      return div;
    };

    legend.addTo(this.map);
  }
}
