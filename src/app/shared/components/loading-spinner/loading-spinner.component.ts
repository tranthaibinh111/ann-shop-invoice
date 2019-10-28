import { Component } from '@angular/core';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.sass']
})
export class LoadingSpinnerComponent {
  public hide: Observable<boolean>;
  public message: Observable<string>;

  constructor(private service: LoadingSpinnerService) {
    this.hide = service.hidden$;
    this.message = service.message$;
  }

}
