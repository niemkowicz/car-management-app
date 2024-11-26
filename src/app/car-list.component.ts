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
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule], // Importing ng-select module
  templateUrl: './car-list.component.html',
})
export class CarListComponent {
  cars: Car[] = [];
  brandsWithModels: BrandModel[] = [];
  availableModels: string[] = [];
  newCar = { make: '', model: '' }; // Default values without year
  filteredBrands: string[] = []; // Storing filtered brands
    isBrandListVisible = false; // To manage visibility of the brand list


  constructor(private router: Router, private http: HttpClient) {
    this.loadBrandsAndModels();
    this.loadCars();
  }

  // Loading brand and model data from JSON
  loadBrandsAndModels() {
    this.http.get<BrandModel[]>('assets/car-list.json').subscribe({
      next: (data) => {
        console.log('Loaded brands:', data); // Debug
        this.brandsWithModels = data;
        this.filteredBrands = data.map((b) => b.brand); // Initialize available brands
      },
      error: (err) => {
        console.error('Error loading car-list.json:', err);
      },
    });
  }

  // Update available models when brand is selected
  onBrandChange() {
    const selectedBrand = this.newCar.make;
    const brand = this.brandsWithModels.find((b) => b.brand === selectedBrand);
    console.log('Selected brand:', selectedBrand, 'Found models:', brand?.models); // Debug
    this.availableModels = brand ? brand.models : [];
    this.newCar.model = ''; // Reset model when changing brand
  }

  // Filter brands based on input
  filterBrands(searchText: string) {
    if (searchText.length === 0) {
      this.filteredBrands = [];
      return;
    }

    this.filteredBrands = this.brandsWithModels
      .filter((b) => b.brand.toLowerCase().startsWith(searchText.toLowerCase()))
      .map((b) => b.brand);
  }

  // Set selected brand
  selectBrand(brand: string) {
    this.newCar.make = brand;
    this.filteredBrands = []; // Hide the list after selecting a brand
    this.onBrandChange(); // Update available models
  }

  addCar() {
    // Sprawdzenie, czy marka i model zostały wybrane
    if (!this.newCar.make || !this.newCar.model) {
      alert('Please select a brand and model!');
      return;
    }
  
    // Generowanie unikalnego ID dla nowego samochodu
    const id = Math.random().toString(36).substring(2, 15);
  
    // Tworzenie nowego obiektu samochodu
    const car = { ...this.newCar, id } as Car;
  
    // Dodanie nowego samochodu na początek listy
    this.cars.unshift(car);
  
    // Zapisanie zaktualizowanej listy (jeśli jest wymagana funkcja saveCars)
    this.saveCars();
  
    // Resetowanie formularza i dostępnych modeli
    this.newCar = { make: '', model: '' }; // Reset po dodaniu
    this.availableModels = []; // Reset modeli
  }
  

  // Navigate to car details
  viewDetails(carId: string) {
    this.router.navigate(['/car-details', carId]);
  }

  // Delete a car from the list
  deleteCar(carId: string) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.cars = this.cars.filter((car) => car.id !== carId);
      this.saveCars(); // Save updated list to localStorage
    }
  }

  // Load cars from localStorage
  private loadCars() {
    const carsJson = localStorage.getItem('cars');
    this.cars = carsJson ? JSON.parse(carsJson) : [];
  }

  // Save cars to localStorage
  private saveCars() {
    localStorage.setItem('cars', JSON.stringify(this.cars));
  }
  
}

