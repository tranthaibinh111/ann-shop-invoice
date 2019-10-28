import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.sass']
})
export class ScrollComponent {
  windowScroll: boolean;

  constructor() {
    this.windowScroll = false;
  }

  /**
   * Lắng nghe sự kiện lăng scroll
   */
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let maxScroll = document.documentElement.scrollHeight || document.body.scrollHeight;

    if (window.pageYOffset > window.innerHeight * 1.5 && window.pageYOffset <= maxScroll - window.innerHeight * 1.5) {
      this.windowScroll = true;
    }
    else {
      this.windowScroll = false;
    }

  }

  /**
   * Đệ quy để scroll lên top
   */
  scrollToTop() {
    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

    (function smoothscroll() {
        currentScroll = currentScroll - (currentScroll / 8);
        // Fix trường hợp chia vô tận với currentScroll > 1
        if(currentScroll < 1)
          currentScroll = 0;
        window.scrollTo(0, currentScroll);

        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
        }
    })();
  }

  /**
   * Đệ quy để scroll xuống cuối trang
   */
  scrollToBottom() {
    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    let maxScroll = document.documentElement.scrollHeight || document.body.scrollHeight;

    (function smoothscroll() {
      currentScroll = currentScroll + (currentScroll / 8);
      window.scrollTo(0, currentScroll);

      if (currentScroll < maxScroll) {
        window.requestAnimationFrame(smoothscroll);
      }
    })();
  }

}
