import Inferno from 'inferno';
// import { BookingEngineRouter } from 'shared-components/booking-engine/components/BookingEngine.jsx';
import { AppRouter } from './Routes.jsx';

Inferno.render(<AppRouter />, document.getElementById('app'));
