import React, { Component } from 'react';
import { connect } from 'react-redux';

import TopProgressLoader from '../layout/TopProgressLoader'; 
import LoadingScreen from '../layout/LoadingScreen'; 
import MovieCard from './MovieCard';
import PaginationBar from '../layout/PaginationBar';
import Footer from '../layout/Footer';
import Filter from '../layout/Filter';

// actions
import { fetchRequest, isCurrentlyFetching } from '../../actions/actions';

// helpers
import { isEmpty, numberWithCommas } from '../../helpers/helperFunctions';

const queryString = 'trending/all/day?';

class TrendingMovies extends Component {
  state = {
    yearFilter: ''
  };

  componentDidMount() {
    if (isEmpty(this.props.trendingMovies)) {
      this.props.fetchRequest('FETCH_TRENDING_MOVIES', queryString);
    }
  }

  handlePageChange = (e) => {
    if (this.props.trendingMovies.activePage !== e) {
      this.props.isCurrentlyFetching();
      this.props.fetchRequest('FETCH_TRENDING_MOVIES', queryString, e);
    }
  };

  render() {
    const { trendingMovies, isLoading, error } = this.props;
    const { yearFilter } = this.state;
    return (
      <React.Fragment>
        <TopProgressLoader isLoading={isLoading} />
        {isEmpty(trendingMovies) && <LoadingScreen />}
        <div className="container">
          <div className="container__wrapper">
            {!isEmpty(trendingMovies) && (
              <React.Fragment>
                <div className="movie__header">
                  <div className="movie__header-title">
                    <h1>Trending Movies</h1>
                    <h3>{numberWithCommas(trendingMovies.total_results)} Movies</h3>
                  </div>
                  <Filter />
                </div>
                <div className="movie__wrapper">
                  {trendingMovies.collection.map((movie) => {
                    return (
                      <MovieCard 
                          category="movie"
                          key={movie.id}
                          movie={movie} 
                      />
                    )
                  })}
                </div>
                <PaginationBar 
                  activePage={trendingMovies.activePage}
                  itemsCountPerPage={1}
                  onChange={this.handlePageChange}
                  pageRangeDisplayed={10}
                  totalItemsCount={trendingMovies.total_pages}
                  totalPage={trendingMovies.total_pages}
              />
              <Footer />
              </React.Fragment>
            )}
          </div>  
      </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ trendingMovies, isLoading, error }) => ({
  trendingMovies,
  isLoading,
  error
});

const mapDispatchToProps = dispatch => ({
  fetchRequest: (action, url, page) => dispatch(fetchRequest(action, url, page)),
  isCurrentlyFetching: bool => dispatch(isCurrentlyFetching(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(TrendingMovies);
