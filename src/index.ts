import { config } from './config';
import { app } from './app';

const port = config.PORT;

app.listen(port, err => {
    if (err) {
        console.log(err);
    }
    return console.log(`Server is listening on ${port}!`);
});