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

interface Skill {
  category: string;
  note?: string;
  items: string[];
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrls: ['./skills.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('skillCard') private skillCards?: QueryList<ElementRef<HTMLElement>>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private animationFrameId?: number;
  private readonly handleViewportChange = () => this.scheduleRevealUpdate();

  readonly revealProgress = signal<number[]>([]);
  skills: Skill[] = [
    {
      category: 'Frontend ',
      items: ['Angular', 'HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    },
    {
      category: 'Backend ',
      items: ['Java', 'Spring Boot(Fundamentals)','MySQL', 'REST API Development'],
    },
    {
      category: 'Tools',
      items: ['GitHub', 'Vscode'],
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
    const cards = this.skillCards?.toArray();

    if (!cards?.length || !this.isBrowser) {
      return;
    }

    const viewportHeight = window.innerHeight || 1;
    const nextProgress = cards.map((card, index) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const revealStart = viewportHeight * 1.02;
      const revealEnd = viewportHeight * 0.6;
      const staggerOffset = index * 0.06;
      const travelDistance = revealStart - revealEnd || 1;
      const normalized = (revealStart - rect.top) / travelDistance - staggerOffset;
      const clamped = Math.max(0, Math.min(normalized, 1));

      return Math.pow(clamped, 0.74);
    });

    this.revealProgress.set(nextProgress);
  }
}
