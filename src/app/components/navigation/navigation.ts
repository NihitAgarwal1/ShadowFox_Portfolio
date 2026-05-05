import { Component, ChangeDetectionStrategy, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnDestroy {
  mobileMenuOpen = signal(false);
  isNavHidden = signal(false);
  private lastScrollY = 0;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  constructor() {
    if (this.isBrowser) {
      this.lastScrollY = window.scrollY;
      window.addEventListener('scroll', this.onWindowScroll, { passive: true });
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll);
    }
  }

  private onWindowScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 0) {
      this.isNavHidden.set(false);
      this.lastScrollY = 0;
      return;
    }

    const scrollingDown = currentScrollY > this.lastScrollY && currentScrollY > 60;
    this.isNavHidden.set(scrollingDown);
    this.lastScrollY = currentScrollY;
  };
}
