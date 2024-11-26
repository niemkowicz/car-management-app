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
  partsCost: number;
  serviceCost: number;
  totalCost: number;
  dateAdded: string;
  isEdited: boolean; // Flaga informująca o edytowaniu
  dateEdited?: string; // Data edytowania (opcjonalna)
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
  cars: Car[] = []; // Lista samochodów
  newCar: Car = { id: '', make: '', model: '' }; // Model do dodawania nowego samochodu
  availableModels: string[] = []; // Modele dostępne dla wybranego brandu
  services: ServiceDetails[] = []; // Lista usług dla samochodu
  serviceDetails: ServiceDetails = { partsCost: 0, serviceCost: 0, totalCost: 0, dateAdded: '', isEdited: false }; // Zaktualizowana struktura danych usługi
  showServiceForm: boolean = false; // Flaga pokazująca formularz usług
  editingServiceIndex: number | null = null; // Indeks edytowanej usługi
  isEditing: boolean = false; // Flaga informująca, czy jesteśmy w trybie edycji

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

  // Załaduj szczegóły samochodu z localStorage
  loadCarDetails(carId: string) {
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    this.car = cars.find((car: Car) => car.id === carId) || null;
  }

  // Załaduj wszystkie samochody z localStorage
  loadCars() {
    this.cars = JSON.parse(localStorage.getItem('cars') || '[]');
  }

  // Załaduj szczegóły usług dla samochodu z localStorage
  loadServiceDetails(carId: string) {
    const savedServiceDetails = JSON.parse(localStorage.getItem('serviceDetails') || '{}');
    this.services = Array.isArray(savedServiceDetails[carId]) ? savedServiceDetails[carId] : [];
  }

  // Zapisz szczegóły usług do listy usług i localStorage
  saveServiceDetails() {
    if (this.car) {
      const savedServiceDetails = JSON.parse(localStorage.getItem('serviceDetails') || '{}');
      
      // Oblicz całkowity koszt
      this.serviceDetails.totalCost = this.serviceDetails.partsCost + this.serviceDetails.serviceCost;

      if (this.editingServiceIndex === null) {
        // Jeśli to nowa usługa, dodajemy datę dodania
        this.serviceDetails.dateAdded = new Date().toLocaleString();
        this.serviceDetails.isEdited = false; // Flaga na false przy dodaniu
        this.serviceDetails.dateEdited = undefined; // Brak daty edytowania
      } else {
        // Jeśli edytujemy istniejącą usługę
        this.serviceDetails.isEdited = true; // Flaga na true przy edycji
        this.serviceDetails.dateEdited = `edited: ${new Date().toLocaleString()}`; // Dodajemy przedrostek "edited"
      }

      // Dodajemy lub edytujemy usługę w localStorage
      if (!Array.isArray(savedServiceDetails[this.car.id])) {
        savedServiceDetails[this.car.id] = [];
      }

      if (this.editingServiceIndex === null) {
        savedServiceDetails[this.car.id].push({ ...this.serviceDetails });
      } else {
        savedServiceDetails[this.car.id][this.editingServiceIndex] = { ...this.serviceDetails };
      }

      // Zaktualizuj localStorage
      localStorage.setItem('serviceDetails', JSON.stringify(savedServiceDetails));

      // Załaduj usługi, aby odzwierciedlić zaktualizowaną listę
      this.loadServiceDetails(this.car.id);

      // Resetujemy formularz po zapisaniu
      this.serviceDetails = { partsCost: 0, serviceCost: 0, totalCost: 0, dateAdded: '', isEdited: false };
      this.showServiceForm = false;
      this.isEditing = false;
    }
  }

  // Przełącz widoczność formularza usług
  toggleServiceForm() {
    this.showServiceForm = !this.showServiceForm;
    this.isEditing = false; // Ukryj tryb edycji, jeśli przełączamy formularz
    if (!this.showServiceForm) {
      this.resetForm(); // Zresetuj formularz, jeśli jest ukryty
    }
  }

  // Edytowanie istniejącej usługi lub zamknięcie formularza edycji
  editService(index: number) {
    if (this.isEditing && this.editingServiceIndex === index) {
      // Jeśli formularz edycji jest już otwarty i klikniesz ponownie ten sam element, zamykamy formularz
      this.cancelEdit();
    } else {
      // W przeciwnym razie rozpoczynamy edycję
      const serviceToEdit = this.services[index];
      this.serviceDetails = { ...serviceToEdit };
      this.editingServiceIndex = index;
      this.showServiceForm = true; // Pokaż formularz w trybie edycji
      this.isEditing = true; // Ustaw flagę na tryb edycji
    }
  }

  // Usuwanie usługi
  deleteService(index: number) {
    if (this.car) {
      // Potwierdzenie usunięcia
      const confirmDelete = window.confirm('Are you sure you want to delete this service?');
      
      if (confirmDelete) {
        const savedServiceDetails = JSON.parse(localStorage.getItem('serviceDetails') || '{}');
        savedServiceDetails[this.car.id].splice(index, 1); // Usuń usługę z tablicy
        localStorage.setItem('serviceDetails', JSON.stringify(savedServiceDetails)); // Zaktualizuj localStorage
  
        // Załaduj usługi, aby odzwierciedlić zaktualizowaną listę
        this.loadServiceDetails(this.car.id);
      }
    }
  }

  // Resetowanie formularza usług
  resetForm() {
    this.serviceDetails = { partsCost: 0, serviceCost: 0, totalCost: 0, dateAdded: '', isEdited: false }; // Resetujemy także datę
    this.editingServiceIndex = null;
    this.isEditing = false; // Zresetuj tryb edycji
  }

  // Anulowanie edycji
  cancelEdit() {
    this.resetForm(); // Resetuje formularz
    this.isEditing = false; // Zresetuj tryb edycji
    this.showServiceForm = false; // Ukryj formularz
  }

  // Dynamicznie oblicz całkowity koszt
  updateTotalCost() {
    this.serviceDetails.totalCost = this.serviceDetails.partsCost + this.serviceDetails.serviceCost;
  }
}
