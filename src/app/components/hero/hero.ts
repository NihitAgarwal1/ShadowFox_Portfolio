import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly descriptors = ['a Web Developer', 'a BCA Student', 'a Problem Solver'];
  private currentDescriptorIndex = 0;
  private currentCharacterIndex = 0;
  private isDeleting = false;
  private timerId?: ReturnType<typeof setTimeout>;

  readonly typedDescriptor = signal('');
  readonly highlights = [
    { value: '2+', label: 'Certificates' },
    { value: '3+', label: 'Projects' },
    { value: '11+', label: 'Skills' },
  ];

  ngOnInit(): void {
    this.runTypewriter();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  private runTypewriter(): void {
    const currentText = this.descriptors[this.currentDescriptorIndex];
    const nextLength = this.isDeleting
      ? this.currentCharacterIndex - 1
      : this.currentCharacterIndex + 1;

    this.currentCharacterIndex = Math.max(0, Math.min(nextLength, currentText.length));
    this.typedDescriptor.set(currentText.slice(0, this.currentCharacterIndex));

    let delay = this.isDeleting ? 45 : 85;

    if (!this.isDeleting && this.currentCharacterIndex === currentText.length) {
      delay = 1500;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharacterIndex === 0) {
      this.isDeleting = false;
      this.currentDescriptorIndex = (this.currentDescriptorIndex + 1) % this.descriptors.length;
      delay = 250;
    }

    this.timerId = setTimeout(() => this.runTypewriter(), delay);
  }
}
