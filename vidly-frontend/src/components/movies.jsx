import React, { Component } from "react";
import MoviesTable from "./moviesTable";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginat";
import ListGroup from "../components/common/listGroup";
import { getGenres } from "../services/genreService";
import { Link } from "react-router-dom";
import _lodash from "lodash";
import SearchBox from "./common/searchBox";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    gernes: [], //getGenres(),
    pageSize: 3,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },

    //Object distruction
    // const count :
  };
  async componentDidMount() {
    const { data } = await getGenres();
    const geners = [{ name: "All Genres", _id: "" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies: movies, gernes: geners });
  }

  handelDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies: movies });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("this Movie has already been deleted");
      }
      this.setState({ movies: originalMovies });
    }
  };

  handelLike = (movie) => {
    // console.log("Like Click", movie);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies: movies });
  };

  handelPageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handelGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handelSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handelSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      searchQuery,
    } = this.state;

    //hier Movie Filtered
    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);
    // ? allMovies.filter((m) => m.genre._id === SelectedGenre._id)
    // : allMovies;

    //hier Movies Sorting
    const sorted = _lodash.orderBy(
      filtered,
      [sortColumn.path],
      [sortColumn.order]
    );

    //hier paging nammit das Filterdlist
    const paginatMovies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: paginatMovies };
  };

  render() {
    const { length: moviesCount } = this.state.movies;

    //Object distructure
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { user } = this.props;

    if (moviesCount === 0)
      return (
        <p className="badge m-2 badge-warning">
          "there is no more Movie in the Database"
        </p>
      );

    const { totalCount, data } = this.getPageData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.gernes}
            onItemSelect={this.handelGenreSelect}
            textProperty="name"
            valuePropert="_id"
            selectedItem={this.state.selectedGenre}
          />
        </div>

        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}

          <p>Showing {totalCount} movies in the Database</p>
          <SearchBox value={searchQuery} onChange={this.handelSearch} />
          <MoviesTable
            onDelete={this.handelDelete}
            onLike={this.handelLike}
            movies={data}
            onSort={this.handelSort}
            sortColumn={sortColumn}
          />
          <Pagination
            itemCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChanged={this.handelPageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
