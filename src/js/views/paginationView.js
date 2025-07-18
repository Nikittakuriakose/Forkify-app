import View from './view';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');


  addHandlerClick(handler){
    this._parentElement.addEventListener('click',function(e){
        const btn=e.target.closest('.btn--inline')
        if(!btn) return

        const goToPage=+btn.dataset.goto 
        handler(goToPage)
    })
  }

  _generateMarkupBtnLeft(curPage) {
    return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
              <span>Page ${curPage + 1}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </button>
            `;
  }

  _generateMarkupBtnRight(curPage) {
    return ` <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          `;
  }

  _generateMarkup() {
    
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
 

    //page1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtnLeft(curPage);
    }

    //last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtnRight(curPage);
    }

    //Other page
    if (curPage < numPages) {
      return (
        this._generateMarkupBtnRight(curPage) +
        this._generateMarkupBtnLeft(curPage)
      );
    }

    //Page1 and there are no other pages
    return '';
  }
}

export default new paginationView();
