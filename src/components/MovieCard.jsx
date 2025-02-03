import React from 'react'
import  starImg from '../images/star.svg'
const MovieCard = ({movie : {title, vote_average, poster_path, release_date, original_language}}) => {
     {/* //we might have to write movie.id, movie.title and etc, instead we can destructure more properties from the movie object */}
  return (
    <div className="movie-card">
        <img 
        src={
            poster_path? `https://image.tmdb.org/t/p/w500/${poster_path}`: '/images/no-movie.png'
        }  alt={title}/>

        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src={starImg} alt="" />
                    <p>{vote_average? vote_average.toFixed(1): 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="lang">{original_language}</p>

                <span>•</span>
                <p className="year">{release_date ? release_date.split('-')[0]: 'N/A' }</p>
            </div>
        </div>
       
    </div>
  )
}

export default MovieCard