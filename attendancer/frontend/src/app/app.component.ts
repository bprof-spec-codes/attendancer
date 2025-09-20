import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EmployeeListComponent } from './employees/employee-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeeListComponent],
  template: `<h1>Employees</h1><app-employee-list></app-employee-list>`
})
export class AppComponent {
  title = 'frontend';
}
