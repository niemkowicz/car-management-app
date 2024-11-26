import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <div class="container">
        <p>&copy; 2024 Car Management App. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      /* Ustawienie całej strony na flexbox */
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Zapewnia, że zawartość wypełnia całe okno przeglądarki */
      }

      /* Główna treść strony */
      .content {
        flex: 1; /* Zajmuje dostępną przestrzeń */
      }

      /* Stylizacja stopki */
      footer {
        background-color: #222;
        display: flex;
        position: absolute;
        align-items: flex-start; /* Wyrównanie tekstu do lewej strony */
        padding: 35px 52px 60px 18px; /* Odległość od lewej: 18px */
        width: 100%; /* Stopka zajmuje całą szerokość */
        box-sizing: border-box;
        color: white; /* Biały tekst */
        margin-top: 600px;
      }

      /* Stylizacja kontenera wewnątrz stopki */
      .container {
        width: 100%; /* Kontener zajmuje pełną szerokość stopki */
      }

      .container p {
        margin: 0; /* Usuń domyślny margines tekstu */
      }

      /* Dodanie przestrzeni 200px od dolnej krawędzi treści */
      .content {
        margin-bottom: 200px; /* Odległość między treścią a stopką */
      }
    `,
  ],
})
export class FooterComponent {}
