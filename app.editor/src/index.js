import renderEditor from './editor';
import renderSimulator from './simulator';

if (window.location.search.includes('simulator=true')) {
  renderSimulator();
} else {
  renderEditor();
}