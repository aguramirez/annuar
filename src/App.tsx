import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import SeatSelection from './components/SeatSelection';
import Login from './components/Login';
import Payment from './components/Payment';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import moviesData from './data/movies.json';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<{date: string, time: string} | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home movies={moviesData.movies} setSelectedMovie={setSelectedMovie} />} />
            <Route path="/movie/:id" element={
              <MovieDetail
                movie={selectedMovie}
                setSelectedShowtime={setSelectedShowtime}
                setTicketCount={setTicketCount}
              />
            } />
            <Route path="/seats" element={
              selectedMovie && selectedShowtime ?
              <SeatSelection
                movie={selectedMovie}
                showtime={selectedShowtime}
                ticketCount={ticketCount}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
              /> :
              <Navigate to="/" />
            } />
            <Route path="/login" element={
              selectedSeats.length > 0 ?
              <Login setIsLoggedIn={setIsLoggedIn} /> :
              <Navigate to="/" />
            } />
            <Route path="/payment" element={
              isLoggedIn ?
              <Payment
                movie={selectedMovie}
                showtime={selectedShowtime}
                ticketCount={ticketCount}
                selectedSeats={selectedSeats}
              /> :
              <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;