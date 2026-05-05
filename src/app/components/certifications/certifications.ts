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

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  previewType: 'pdf';
}

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.html',
  styleUrls: ['./certifications.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificationsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('certificateCard') private certificateCards?: QueryList<ElementRef<HTMLElement>>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private animationFrameId?: number;
  private readonly handleViewportChange = () => this.scheduleRevealUpdate();

  readonly revealProgress = signal<number[]>([]);
  certifications: Certification[] = [
    {
      id: 1,
      title: 'HTML5 - The Language',
      issuer: 'Infosys Springboard',
      date: 'February 11, 2026',
      credentialUrl: '/certifications/html-certificate.pdf',
      previewType: 'pdf',
    },
    {
      id: 2,
      title: 'CSS Certificate',
      issuer: 'Infosys Springboard',
      date: '2026',
      credentialUrl: '/certifications/css-certificate.pdf',
      previewType: 'pdf',
    },
  ];

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

  cardReveal(index: number): string {
    return (this.revealProgress()[index] ?? 0).toFixed(3);
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
    const cards = this.certificateCards?.toArray();

    if (!cards?.length || !this.isBrowser) {
      return;
    }

    const viewportHeight = window.innerHeight || 1;
    const nextProgress = cards.map((card) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const fullyVisibleHeight = Math.min(rect.height, viewportHeight * 0.8) || 1;
      const visibilityRatio = visibleHeight / fullyVisibleHeight;

      return Math.pow(Math.max(0, Math.min(visibilityRatio, 1)), 0.85);
    });

    this.revealProgress.set(nextProgress);
  }
}
