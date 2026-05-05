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

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  github: string;
  image: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('projectCard') private projectCards?: QueryList<ElementRef<HTMLElement>>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private animationFrameId?: number;
  private readonly handleViewportChange = () => this.scheduleRevealUpdate();

  readonly revealProgress = signal<number[]>([]);
  projects: Project[] = [
    {
      id: 3,
      title: 'Hospital Management System',
      description: 'Designed and implemented a scalable hospital management system featuring structured appointment handling, patient data organization, and workflow automation, aimed at enhancing efficiency, reducing manual overhead, and delivering a seamless user experience for healthcare operations.',
      technologies: ['HTML', 'CSS', 'TypeScript', 'Firebase'],
      link: 'https://hospital-data-c0fa0.web.app',
      github: 'https://github.com/NihitAgarwal1/Hospital_Management_System',
      image: '/images/hospital-management-screenshot.png',
    },
    {
      id: 2,
      title: 'Tic-Tac-Toe Game',
      description: 'A simple browser-based tic-tac-toe game with a bold visual style and quick turn-based play.',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      link: 'https://tic-tac-toe-lemon-ten.vercel.app',
      github: 'https://github.com/NihitAgarwal1/TIC-TAC-TOE',
      image: '/images/tic-tac-toe-screenshot.png',
    },
    {
      id: 1,
      title: 'Currency Converter',
      description: 'Implemented a real-time currency conversion tool with efficient API integration and user-friendly UI.',
      technologies: ['HTML', 'CSS', 'REST API', 'JavaScript'],
      link: 'https://currency-converter-flame-one.vercel.app',
      github: 'https://github.com/NihitAgarwal1/Currency-Converter',
      image: '/images/currency-converter-screenshot.png',
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
    const cards = this.projectCards?.toArray();

    if (!cards?.length || !this.isBrowser) {
      return;
    }

    const viewportHeight = window.innerHeight || 1;
    const nextProgress = cards.map((card) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const fullyVisibleHeight = Math.min(rect.height, viewportHeight * 0.82) || 1;
      const visibilityRatio = visibleHeight / fullyVisibleHeight;
      const softenedProgress = Math.pow(Math.max(0, Math.min(visibilityRatio, 1)), 0.9);

      return softenedProgress;
    });

    this.revealProgress.set(nextProgress);
  }
}
