import {app} from './app.js';

app.listen(app.get('port'), () => {
    console.log('servidor escuchanado en el puerto', app.get('port'));
});