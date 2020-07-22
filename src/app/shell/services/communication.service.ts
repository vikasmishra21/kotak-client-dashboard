import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { forkJoin, Observable, of, pipe, timer } from 'rxjs';
import { HttpClientUtil } from '../util/httpClient';
import { combineAll, concatAll, flatMap, map, mergeAll, mergeMap, take } from 'rxjs/operators';
import { CollectionOutput } from '../models/collectionOutput';
import { DataTransformer } from '../util/dataTransformer';
import { CollectionUtil } from '../util/collectionUtil';
import { TreeType } from '../enums/tree.type';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly STORAGE_KEYS = {
    QuestionnaireVersion: 'qversion',
    QuestionnaireData: ''
  };

  constructor(private http: HttpClientUtil) {
    const version = localStorage.getItem(this.STORAGE_KEYS.QuestionnaireVersion);
    this.STORAGE_KEYS.QuestionnaireData = `tree_${version}`;
    const qData = localStorage.getItem(this.STORAGE_KEYS.QuestionnaireData);
    if (qData !== null) {
      CollectionUtil.setVariableMap(JSON.parse(qData));
    } else {
      //router.navigate(['/']);
    }
    // CollectionUtil.setVariableMap(new SurveyTree().getSurveyTree());
  }

  populateVariableMap(): Observable<void> {
    const stream = this.getQuestionnaireVersion()
      .pipe(
        map(
          (version: string) => {
            localStorage.setItem(this.STORAGE_KEYS.QuestionnaireVersion, version);
            return timer(0, 100).pipe(
              take(this.http.TREE_TYPES.length),
              map(treeIndex => this.getExpandedSurveyTree(version, this.http.TREE_TYPES[treeIndex]))
            );
          }),
      );
    return stream.pipe(flatMap(value => value)).pipe(combineAll(value => value));
  }

  getQuestionnaireVersion(): Observable<string> {
    const quesURL = `${this.http.PATHS.PROJECT_URL}Survey/SurveyProperties/`;
    if (localStorage.getItem(this.STORAGE_KEYS.QuestionnaireVersion) === null) {
      return this.http.get(quesURL).pipe(map((response: any) => response.ActiveQuestionnaireVersion + 1));
    } else {
      return Observable
        .create(obs => {
          obs.next(localStorage.getItem(this.STORAGE_KEYS.QuestionnaireVersion));
          obs.complete();
        });
    }
  }

  getExpandedSurveyTree(version: string, type: TreeType): Observable<void> {
    const surveyTreeURL = `${this.http.PATHS.PROJECT_URL}Survey/${version}/SurveyTree/${type}?expand=true`;
    this.STORAGE_KEYS.QuestionnaireData = `tree_${version}`;
    // means not present locally then delete locally stored survey tree
    if (localStorage.getItem(this.STORAGE_KEYS.QuestionnaireData) === null) {
      for (const i in localStorage) {
        if (localStorage.hasOwnProperty(i) && i.indexOf('tree_') > -1) {
          localStorage.removeItem(i);
        }
      }
      return this.http.get(surveyTreeURL)
        .pipe(
          map((response: any) => {
            const variableMap = CollectionUtil.populateVariableMap(response.RootNodes);
            const objMap = Array.from(variableMap).reduce((obj, [key, value]) => (
              Object.assign(obj, { [key]: value })
            ), {});
            localStorage.setItem(this.STORAGE_KEYS.QuestionnaireData, JSON.stringify(objMap));
          }));
    } else {
      return Observable.create(
        obs => {
          if (!CollectionUtil.hasVariableMap()) {
            CollectionUtil.setVariableMap(JSON.parse(localStorage.getItem(this.STORAGE_KEYS.QuestionnaireData)));
          }
          obs.next();
          obs.complete();
        });
    }
  }

  getCollectionOutput(collection: Collection): Observable<CollectionOutput> {
    const url = this.http.PATHS.PROJECT_URL + 'Analysis/Collection';
    return this.http.post(url, collection)
      .pipe(
        map((response: any) => {
          const output = new CollectionOutput();
          // TODO: calculate base logic
          // TODO: if sig test then add
          Object.keys(response[collection.Name]).forEach(value => {
            output.RawData = response[collection.Name][value];
            const flatData = DataTransformer.toFlatTableOutput(response[collection.Name][value], collection.getAnalysisType());
            output.TableOutput.set(value, flatData.filter(v => {
              return v.SeriesCode !== 'unweightedbase' && v.SeriesCode !== 'effectivebase' && v.SeriesCode !== 'base';
            }));
            output.Bases.set(value, flatData.filter(v => v.SeriesCode === 'base'));
            output.EffectiveBases.set(value, flatData.filter(v => v.SeriesCode === 'effectivebase'));
            for (const k in response[collection.Name][value].sigtest) {
              if (response[collection.Name][value].sigtest.hasOwnProperty(k)) {
                output.Significant.set(k, response[collection.Name][value].sigtest[k]);
              }
            }
          });
          return output;
        })
      );
  }

  getFilterData(filterSyntax: object): Observable<any> {
    const url = this.http.PATHS.PROJECT_URL + 'Analysis/FilterCascadingwithfilter';
    return this.http.post(url, filterSyntax);
  }

  getFile(fileName: string): Observable<any> {
    return this.http.get(fileName);
  }

}
