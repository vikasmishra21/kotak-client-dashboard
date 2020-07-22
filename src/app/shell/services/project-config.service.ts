import {InjectionToken} from '@angular/core';
import {ProjectConfig} from '../interfaces/project-config';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the project config object, provided from the outside to the shell module
 */
export const ProjectConfigService = new InjectionToken<ProjectConfig>('ProjectConfig');
