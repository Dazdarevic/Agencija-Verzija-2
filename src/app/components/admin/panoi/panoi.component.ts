import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin service/admin.service';
import { PhotoService } from '../../../services/photo service/photo.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../../services/local storage service/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'panoi',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panoi.component.html',
  styleUrls: ['./panoi.component.css'] // ispravka: styleUrl -> styleUrls
})

export class PanoiComponent implements OnInit {
  addForm!: FormGroup;
  products: any[] = [];
  selectedFile!: any;

  constructor(
    private photoService: PhotoService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorageService: LocalStorageService // Dodaj LocalStorageService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.addForm = this.formBuilder.group({
        adresa: [''],
        grad: [''],
        slika: [''],
        zona: [''],
        dimenzija: [''],
        cijena: [''],
        osvetljenost: [''],
        latitude: [''],
        longitude: [''],
        adminAgencijeId: [''],
      });

      this.setAdminAgencijeId(); // Pozovi novu metodu
    }
  }

  setAdminAgencijeId(): void {
    const token = this.localStorageService.getItem('token'); // Koristi LocalStorageService
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.addForm.patchValue({
        adminAgencijeId: decodedToken?.UserId // Postavi adminAgencijeId na formu
      });
    }
  }

  handleSubmit(): void {
    console.log("radi");
    // if (this.addForm.valid) {
      const formValue = this.addForm.value;
      formValue.urlSlike = this.selectedFile; // Izvuci url slike iz `selectedFile`

      const data = {
        adminAgencijeId: formValue.adminAgencijeId,
        adminAgencije: null,
        urlSlike: this.selectedFile,
        adresa: formValue.adresa,
        dimenzija: formValue.dimenzija,
        osvetljenost: formValue.osvetljenost,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        grad: formValue.grad,
        zona: formValue.zona,
        cijena: formValue.cijena,
        statusZauzetosti: false
      };

      console.log(formValue);
      this.adminService.dodajReklamniPano(data).subscribe(
        (response) => {
          console.log(' added:', response);
          this.addForm.reset();
          this.toastr.success('', 'Uspesno ste dodali reklamni pano!');
        },
        (error) => {
          console.error('Error adding:', error);
          this.toastr.error('', 'Neuspesno dodavanje reklamnog panoa!');
        }
      );
    // }
  }

  getFile(event: any) {
    const file: File = event.target.files[0];
    console.log("file" + file);
    this.uploadPhoto(file);
  }

  uploadPhoto(file: File) {
    this.photoService.sendPhoto(file).subscribe(
      (response) => {
        this.selectedFile = response.secureUrl;
        console.log("slika", this.selectedFile);
        console.log("Photo uploaded successfully", response.url);
      },
      (error) => {
        console.log("Error " + error.response);
      }
    );
  }
}
