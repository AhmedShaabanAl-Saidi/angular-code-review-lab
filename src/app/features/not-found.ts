import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `<div class="container not-found">
    <p class="eyebrow">A little off the beaten path</p>
    <h1>Nothing here. Yet.</h1>
    <p>We couldn't find that page. Your next favorite might be just around the corner.</p>
    <a class="button" routerLink="/products">Explore the collection ↗</a>
  </div>`,
})
export class NotFoundPage { }
