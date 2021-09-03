/**********************************************************
 * Application loader
 * Avoids circular dependencies between page and templates
 *  app -> page
 *  app -> templates -> page
 **********************************************************/

import * as templates from './templates.js';
import { page } from './page.js';

page.templates = templates;
