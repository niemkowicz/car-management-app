import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Car {
  id: string;
  make: string;
  model: string;
}

interface ServiceDetails {
  partsCost: number | null; // Koszt części, może być null
  serviceCost: number | null; // Koszt usługi, może być null
  totalCost: number;
  dateAdded: string;
  isEdited: boolean;
  dateEdited?: string;
}

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-details.component.html',
})
export class CarDetailsComponent implements OnInit {
  carId: string = '';
  car: Car | null = null;
  cars: Car[] = [];
  newCar: Car = { id: '', make: '', model: '' };
  availableModels: string[] = [];
  services: ServiceDetails[] = [];
  serviceDetails: ServiceDetails = { partsCost: null, serviceCost: null, totalCost: 0, dateAdded: '', isEdited: false };
  showServiceForm: boolean = false;
  editingServiceIndex: number | null = null;
  isEditing: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.carId = carId;
      this.loadCarDetails(carId);
      this.loadServiceDetails(carId);
    }
    this.loadCars(); // Załaduj samochody przy inicjalizacji
  }

  loadCarDetails(carId: string) {
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    this.car = cars.find((car: Car) => car.id === carId) || null;
  }

  loadCars() {
    this.cars = JSON.parse(localStorage.getItem('cars') || '[]');
  }

  loadServiceDetails(carId: string) {
    const savedServiceDetails = JSON.parse(localStorage.getItem('serviceDetails') || '{}');
    this.services = Array.isArray(savedServiceDetails[carId]) ? savedServiceDetails[carId] : [];
  }

  saveServiceDetails() {
    if (this.car) {
      // Sprawdzanie, czy pola są puste (null) lub równe 0
      if (
        (this.serviceDetails.partsCost === null || this.serviceDetails.partsCost === 0) &&
        (this.serviceDetails.serviceCost === null || this.serviceDetails.serviceCost === 0)
      ) {
        alert('Both parts cost and service cost must have valid values and cannot be empty or zero.');
        return;
      }
  
      const savedServiceDetails = JSON.parse(localStorage.getItem('serviceDetails') || '{}');
  
      this.serviceDetails.totalCost = (this.serviceDetails.partsCost ?? 0) + (this.serviceDetails.serviceCost ?? 0);
  
      if (this.editingServiceIndex === null) {
        this.serviceDetails.dateAdded = new Date().toLocaleString();
        this.serviceDetails.isEdited = false;
        this.serviceDetails.dateEdited = undefined;
      } else {
        this.serviceDetails.isEdited = true;
        this.serviceDetails.dateEdited = `edited: ${new Date().toLocaleString()}`;
      }
  
      if (!Array.isArray(savedServiceDetails[this.car.id])) {
        savedServiceDetails[this.car.id] = [];
      }
  
      if (this.editingServiceIndex === null) {
        savedServiceDetails[this.car.id].push({ ...this.serviceDetails });
      } else {
        savedServiceDetails[this.car.id][this.editingServiceIndex] = { ...this.serviceDetails };
      }
  
      localStorage.setItem('serviceDetails', JSON.stringify(savedServiceDetails));
  
      this.loadServiceDetails(this.car.id);
  
      this.serviceDetails = { partsCost: null, serviceCost: null, totalCost: 0, dateAdded: '', isEdited: false };
      this.showServiceForm = false;
      this.isEditing = false;
    }
  }

  checkForZeroValues() {
    if (this.serviceDetails.partsCost === 0 && this.serviceDetails.serviceCost === 0) {
      this.serviceDetails.partsCost = null;
      this.serviceDetails.serviceCost = null;
      alert('Both parts cost and service cost cannot be zero.');
    }
  }

  toggleServiceForm() {
    this.showServiceForm = !this.showServiceForm;
    this.isEditing = false;
    if (!this.showServiceForm) {
      this.resetForm();
    }
  }

  editService(index: number) {
    if (this.isEditing && this.editingServiceIndex === index) {
      this.cancelEdit();
    } else {
      const serviceToEdit = this.services[index];
      this.serviceDetails = { ...serviceToEdit };
      this.editingServiceIndex = index;
      this.showServiceForm = true;
      this.isEditing = true;
    }
  }

  deleteService(index: number) {
    if (this.car) {
      const confirmDelete = window.confirm('Are you sure you want to delete this service?');
      if (confirmDelete) {
        const savedServiceDetails = JSON.parse(localStorage.getItem('serviceDetails') || '{}');
        savedServiceDetails[this.car.id].splice(index, 1);
        localStorage.setItem('serviceDetails', JSON.stringify(savedServiceDetails));
        this.loadServiceDetails(this.car.id);
      }
    }
  }

  resetForm() {
    this.serviceDetails = { partsCost: null, serviceCost: null, totalCost: 0, dateAdded: '', isEdited: false };
    this.editingServiceIndex = null;
    this.isEditing = false;
  }

  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
    this.showServiceForm = false;
  }

  updateTotalCost() {
    this.serviceDetails.totalCost = (this.serviceDetails.partsCost ?? 0) + (this.serviceDetails.serviceCost ?? 0);
  }
}
