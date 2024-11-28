import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarDetailsComponent } from './car-details.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs'; // dla mockowania danych

describe('CarDetailsComponent', () => {
  let component: CarDetailsComponent;
  let fixture: ComponentFixture<CarDetailsComponent>;

  // Mockowanie localStorage przed każdym testem
  let localStorageMock: any;

  beforeEach(async () => {
    // Tworzenie mocka dla localStorage
    localStorageMock = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
    };
    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);

    await TestBed.configureTestingModule({
      declarations: [CarDetailsComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' // Mockowanie ID samochodu
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load car details from localStorage when car ID is provided', () => {
    const mockCar = { id: '1', make: 'Toyota', model: 'Corolla' };
    localStorageMock.getItem.and.returnValue(JSON.stringify([mockCar]));
    
    component.ngOnInit(); // Inicjalizacja komponentu

    expect(component.car).toEqual(mockCar);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('cars');
  });

  it('should correctly calculate the total cost', () => {
    component.serviceDetails.partsCost = 100;
    component.serviceDetails.serviceCost = 50;
    
    component.updateTotalCost(); // Funkcja obliczająca całkowity koszt
    
    expect(component.serviceDetails.totalCost).toBe(150);
  });

  it('should not display parts cost and service cost if their value is 0', () => {
    const service = {
      partsCost: 0,
      serviceCost: 0,
      totalCost: 0,
      dateAdded: '2024-11-26',
      isEdited: false
    };
    
    component.services = [service];
    fixture.detectChanges(); // Uruchomienie zmian w widoku

    const compiled = fixture.nativeElement;
    const partsCost = compiled.querySelector('span.parts-cost');
    const serviceCost = compiled.querySelector('span.service-cost');
    const totalCost = compiled.querySelector('span.total-cost');

    expect(partsCost).toBeNull();
    expect(serviceCost).toBeNull();
    expect(totalCost).toBeNull();
  });

  it('should display message when no services are added', () => {
    component.services = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const message = compiled.querySelector('h3');
    
    expect(message.textContent).toContain('No services added yet.');
  });

  it('should save service details when form is submitted', () => {
    component.serviceDetails.partsCost = 100;
    component.serviceDetails.serviceCost = 50;
    component.saveServiceDetails();

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'serviceDetails', 
      jasmine.any(String)
    );
  });

  it('should display edit form when edit button is clicked', () => {
    component.editService(0);
    fixture.detectChanges();

    expect(component.showServiceForm).toBeTrue();
    expect(component.isEditing).toBeTrue();
  });

  it('should cancel editing when cancel button is clicked', () => {
    component.cancelEdit();
    fixture.detectChanges();

    expect(component.showServiceForm).toBeFalse();
    expect(component.isEditing).toBeFalse();
  });
});
