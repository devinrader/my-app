/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';


render(() => <Router><App /></Router>, document.getElementById('root') as HTMLElement);
