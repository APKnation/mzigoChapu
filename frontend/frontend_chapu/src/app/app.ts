import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StickyHeader } from './components/sticky-header/sticky-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StickyHeader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mzigoChapU');
}