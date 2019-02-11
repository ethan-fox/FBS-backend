import { config } from '../config';
import ArticleController from './ArticleController';

export = (app) => {
    const endpoint = 'articles';

    app.post(endpoint, ArticleController.postArticle);

    app.get(endpoint + '/:articleId', ArticleController.getArticle);
};
