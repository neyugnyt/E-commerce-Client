import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './model';
import { environment } from '../environment';
@Injectable()
export class AppConfig {
  static settings: IAppConfig;
  constructor(private http: HttpClient) { }
  load() {
    const jsonFile = `assets/env/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http
        .get(jsonFile)
        .toPromise()
        .then((response: any) => {
          if (response.Data) {
            response = JSON.parse(response);
          }

          AppConfig.settings = response as IAppConfig;
          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
    });
  }
}
