import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('highlightCard') private highlightCards?: QueryList<ElementRef<HTMLElement>>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private animationFrameId?: number;
  private readonly handleViewportChange = () => this.scheduleRevealUpdate();

  readonly revealProgress = signal<number[]>([]);

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    window.addEventListener('scroll', this.handleViewportChange, { passive: true });
    window.addEventListener('resize', this.handleViewportChange, { passive: true });
    this.updateRevealProgress();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    window.removeEventListener('scroll', this.handleViewportChange);
    window.removeEventListener('resize', this.handleViewportChange);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  highlightReveal(index: number): string {
    const progress = this.revealProgress()[index] ?? 0;
    return progress.toFixed(3);
  }

  private scheduleRevealUpdate(): void {
    if (this.animationFrameId || !this.isBrowser) {
      return;
    }

    this.animationFrameId = window.requestAnimationFrame(() => {
      this.animationFrameId = undefined;
      this.updateRevealProgress();
    });
  }

  private updateRevealProgress(): void {
    const cards = this.highlightCards?.toArray();

    if (!cards?.length || !this.isBrowser) {
      return;
    }

    const viewportHeight = window.innerHeight || 1;
    const nextProgress = cards.map((card, index) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const revealStart = viewportHeight * 1.02;
      const revealEnd = viewportHeight * 0.62;
      const staggerOffset = index * 0.05;
      const travelDistance = revealStart - revealEnd || 1;
      const normalized = (revealStart - rect.top) / travelDistance - staggerOffset;
      const clamped = Math.max(0, Math.min(normalized, 1));

      return Math.pow(clamped, 0.72);
    });

    this.revealProgress.set(nextProgress);
  }
}
