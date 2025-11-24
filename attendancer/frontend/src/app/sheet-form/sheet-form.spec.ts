import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheetForm } from './sheet-form';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../services/mock-data.service';
import { of } from 'rxjs';

describe('SheetForm', () => {
  let component: SheetForm;
  let fixture: ComponentFixture<SheetForm>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('MockDataService', ['postEvent', 'updateEvent', 'getEventsByUserId', 'getEventGroupsWithMetadataByUserId']);

    // Hogy ne fusson hibára.
    mockDataService.getEventsByUserId.and.returnValue(of([]));
    mockDataService.getEventGroupsWithMetadataByUserId.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [SheetForm],
      providers: [{ provide: MockDataService, useValue: mockDataService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Események és esemény csoportok mock adatai.
    component.events = [
      { id: 'event1', metadata: ['eventMetadata1', 'eventMetadata2'] },
      { id: 'event2', metadata: ['eventMetadata3'] }
    ];
    component.eventGroups = [
      { id: 'eventGroup1', metadata: ['eventGroupMetadata1'] },
      { id: 'eventGroup2', metadata: ['eventGroupMetadata2', 'eventGroupMetadata3'] }
    ];
  });

  describe('component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputInvalid', () => {
    it('should return true if name and date is empty', () => {
      // Mindkettő üres.
      component.currentEvent.name = '';
      component.currentEvent.date = '';

      expect(component.inputInvalid()).toBeTrue();
    });

    it('should return true if name is empty', () => {
      // Csak a esemény dátuma van megadva.
      component.currentEvent.name = '';
      component.currentEvent.date = '2025-11-14T01:10';

      expect(component.inputInvalid()).toBeTrue();
    });

    it('should return true if date is empty', () => {
      // Csak az esemény neve van megadva.
      component.currentEvent.name = 'Event Name';
      component.currentEvent.date = '';

      expect(component.inputInvalid()).toBeTrue();
    });

    it('should return false if both name and date are not empty', () => {
      // Van értéke az esemény nevének és dátumának.
      component.currentEvent.name = 'Event Name';
      component.currentEvent.date = '2025-11-14T01:10';

      expect(component.inputInvalid()).toBeFalse();
    });
  });

  describe('onSelectionChange', () => {
    it('should update currentEvent.eventGroupId and currentlySelectedMetadata when an event is selected', () => {
      // Egy esemény kiválasztása.
      const selectedValue = 'event1';
      component.onSelectionChange(selectedValue);

      expect(component.currentEvent.eventGroupId).toBe(selectedValue);
      expect(component.currentlySelectedMetadata).toEqual(['eventMetadata1', 'eventMetadata2']);
    });

    it('should update currentEvent.eventGroupId and currentlySelectedMetadata when an event group is selected', () => {
      // Egy esemény csoport kiválasztása.
      const selectedValue = 'eventGroup1';
      component.onSelectionChange(selectedValue);

      expect(component.currentEvent.eventGroupId).toBe(selectedValue);
      expect(component.currentlySelectedMetadata).toEqual(['eventGroupMetadata1']);
    });

    it('should not update currentEvent.eventGroupId when in edit mode', () => {
      // Szerkesztő módban egy esemény kiválasztása.
      const selectedValue = 'event1';
      component.editMode = true;
      component.onSelectionChange(selectedValue);

      expect(component.currentEvent.eventGroupId).toBe('');
      expect(component.currentlySelectedMetadata).toEqual(['eventMetadata1', 'eventMetadata2']);
    });
  });

  describe('createSheet', () => {
    it('should call postEvent and resetPage when the input is valid', () => {
      // Érvényes bemenet.
      component.currentEvent.name = 'Test Event';
      component.currentEvent.date = '2025-11-14';
      component.currentEvent.metadata = ['validData1', undefined, '', 'validData2'];

      spyOn(component, 'resetPage');

      component.createSheet();

      expect(component.currentEvent.metadata).toEqual(['validData1', 'validData2']);
      expect(mockDataService.postEvent).toHaveBeenCalledWith(component.currentEvent);
      expect(component.resetPage).toHaveBeenCalled();
    });

    it('should not call postEvent if input is invalid', () => {
      // Érvénytelen bemenet.
      component.currentEvent.name = '';
      component.currentEvent.date = '2025-11-14';

      component.createSheet();

      expect(mockDataService.postEvent).not.toHaveBeenCalled();
    });
  });

  describe('editSheet', () => {
    it('should call updateEvent if the input is valid', () => {
      // Érvényes bemenet.
      component.currentEvent.name = 'Test Event';
      component.currentEvent.date = '2025-11-14';
      component.currentEvent.metadata = ['validData1', undefined, '', 'validData2'];

      component.editSheet();

      expect(component.currentEvent.metadata).toEqual(['validData1', 'validData2']);
      expect(mockDataService.updateEvent).toHaveBeenCalledWith(component.currentEvent);
    });

    it('should not call postEvent if input is invalid', () => {
      // Érvénytelen bemenet.
      component.currentEvent.name = '';
      component.currentEvent.date = '2025-11-14';
      component.currentEvent.metadata = ['validData1', undefined, '', 'validData2'];

      component.editSheet();

      expect(mockDataService.updateEvent).not.toHaveBeenCalled();
    });
  });

  describe('addCustomField', () => {
    it('should add a new custom field', () => {
      // Egy új mező hozzáadása.
      component.addCustomField();

      expect(component.customFields.length).toBe(1);
    });
  });

  describe('removeCustomField', () => {
    it('should remove a custom field and clear metadata', () => {
      // Kettő új mező hozzáadása, majd az első törlése.
      component.addCustomField();
      component.addCustomField();
      component.removeCustomField(0);

      expect(component.customFields.length).toBe(1);
      expect(component.currentEvent.metadata[0]).toBe('');
      expect(component.currentEvent.metadata[1]).toBe(undefined);
    });
  });

  describe('resetPage', () => {
    it('should reset all properties to their default values', () => {
      // Értékek beállítása.
      component.customFields = [1, 2];
      component.selectedEventOrEventGroup = 'eventOrEventGroup';
      component.currentEvent = {
        name: 'Sample Event',
        eventGroupId: 'eventGroupId',
        date: '2025-11-14',
        metadata: ['metadata1']
      };
      component.events = [{ id: 'eventIs1', metadata: ['metadata1'] }];
      component.eventGroups = [{ id: 'eventGroupId', metadata: ['eventGroupMetadata1'] }];
      component.currentlySelectedMetadata = ['metadata1'];
      component.userId = '2';

      spyOn(component, 'ngOnInit');

      component.resetPage();

      // Mindennek üresnek kell lennie.
      expect(component.customFields).toEqual([]);
      expect(component.selectedEventOrEventGroup).toBe('');
      expect(component.currentEvent).toEqual({
        name: '',
        eventGroupId: '',
        date: '',
        metadata: []
      });
      expect(component.events).toEqual([]);
      expect(component.eventGroups).toEqual([]);
      expect(component.currentlySelectedMetadata).toEqual([]);
      expect(component.userId).toMatch(/\d/);
      expect(component.ngOnInit).toHaveBeenCalled();
    });
  });
});
