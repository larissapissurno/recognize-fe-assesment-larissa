import { Application } from "@hotwired/stimulus"
import * as bootstrap from 'bootstrap';

import '../controllers';

console.log('Vite application.js loaded', { bootstrap });



const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
