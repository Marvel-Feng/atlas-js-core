import createModel from './base_model';
import { Brand, Price, Unit } from './article_models';
import { Image, Video } from './catalog_api_models';

/**
 * @class Class for Recommended Article model
 * @param {String} id - id of article.
 * @param {String} tracking_string - the tracking string to help with recommendations
 * @param {String} name - name of article.
 * @param {Price} lowestPrice - lowestPrice of article.
 * @param {Brand} brand - brand of article.
 * @param {Image[]} images - Array of article images.
 * @param {Video[]} videos - Array of article videos.
 * @param {Unit[]} units - Array of article units.
 * @constructor
 */
const RecommendedArticle = createModel({
  id: { key: 'id', type: 'string' },
  trackingString: { key: 'tracking_string', type: 'string', optional: true },
  name: { key: 'name', type: 'string' },
  brand: { key: 'brand', type: 'object', model: Brand },
  lowestPrice: { key: 'lowest_price', type: 'object', model: Price },
  images: { key: 'images', type: 'object', model: Image, optional: true },
  videos: { key: 'videos', type: 'object', model: Video, optional: true },
  units: { key: 'units', type: 'object', model: Unit },
  productGroup: { key: 'product_group', type: 'string', optional: true }
});

export { RecommendedArticle };
