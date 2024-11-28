import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NgSelectModule } from '@ng-select/ng-select'; // Importing ng-select

interface Car {
  id: string;
  make: string;
  model: string;
}

interface BrandModel {
  brand: string;
  models: string[];
}

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule], 
  templateUrl: './car-list.component.html',
})
export class CarListComponent {
  cars: Car[] = [];
  brandsWithModels: BrandModel[] = [];
  availableModels: string[] = [];
  newCar = { make: '', model: '' }; 
  filteredBrands: string[] = []; 
    isBrandListVisible = false; 


  constructor(private router: Router, private http: HttpClient) {
    this.loadBrandsAndModels();
    this.loadCars();
  }

  // Loading brand and model data from JSON
  loadBrandsAndModels() {
    this.http.get<BrandModel[]>('assets/car-list.json').subscribe({
      next: (data) => {
        console.log('Loaded brands:', data); 
        this.brandsWithModels = data;
        this.filteredBrands = data.map((b) => b.brand); 
      },
      error: (err) => {
        console.error('Error loading car-list.json:', err);
      },
    });
  }

  onBrandChange() {
    const selectedBrand = this.newCar.make;
    const brand = this.brandsWithModels.find((b) => b.brand === selectedBrand);
    console.log('Selected brand:', selectedBrand, 'Found models:', brand?.models); 
    this.availableModels = brand ? brand.models : [];
    this.newCar.model = ''; 
  }

  filterBrands(searchText: string) {
    if (searchText.length === 0) {
      this.filteredBrands = [];
      return;
    }

    this.filteredBrands = this.brandsWithModels
      .filter((b) => b.brand.toLowerCase().startsWith(searchText.toLowerCase()))
      .map((b) => b.brand);
  }

  selectBrand(brand: string) {
    this.newCar.make = brand;
    this.filteredBrands = []; 
    this.onBrandChange(); 
  }

  addCar() {
    if (!this.newCar.make || !this.newCar.model) {
      alert('Please select a brand and model!');
      return;
    }
  
    const id = Math.random().toString(36).substring(2, 15);
  
    const car = { ...this.newCar, id } as Car;
  
    this.cars.unshift(car);
  
    this.saveCars();
  
    this.newCar = { make: '', model: '' }; 
    this.availableModels = []; 
  }
  

  viewDetails(carId: string) {
    this.router.navigate(['/car-details', carId]);
  }

  deleteCar(carId: string) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.cars = this.cars.filter((car) => car.id !== carId);
      this.saveCars(); 
    }
  }

  private loadCars() {
    const carsJson = localStorage.getItem('cars');
    this.cars = carsJson ? JSON.parse(carsJson) : [];
  }

  private saveCars() {
    localStorage.setItem('cars', JSON.stringify(this.cars));
  }
}