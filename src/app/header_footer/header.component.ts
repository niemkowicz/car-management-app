import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule], // Importowanie routerLink
  template: `
    <header>
      <nav class="navbar">
        <div class="container">
          <a href="/" class="logo">Car Management</a>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      header {
        background-color: #333;
          position: relative;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center; /* Wyśrodkuj zawartość pionowo */
            padding: 30px 0;
            width: 100vw;
            box-sizing: border-box;
            margin-bottom: 44.4px;
      }
  


      .navbar .logo {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        color: white;
        text-decoration: none;
        margin-left: 18px;
      }

      .nav-links li a {
        color: white;
        text-decoration: none;
        font-size: 16px;
      }

      .nav-links li a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class HeaderComponent {}
