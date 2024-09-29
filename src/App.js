import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PointsProvider } from './context/PointsContext';
import { EnergyProvider } from './context/EnergyContext'; // Import EnergyProvider
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import EcosystemPage from './components/EcosystemPage';
import FriendPage from './components/FriendPage';
import AirdropPage from './components/AirdropPage';
import GamesPage from './components/GamesPage';
import SpinWheelPage from './components/SpinWheelPage';
import LoadingPage from './components/LoadingPage';
import ProtectedRoute from './components/ProtectedRoute';
import LeaderboardPage from './components/LeaderboardPage';
import LevelPage from './components/LevelPage';

function App() {
  return (
    <PointsProvider>
      <EnergyProvider> 
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LoadingPage />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/earn"
                element={
                  <ProtectedRoute>
                    <TaskList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ecosystem"
                element={
                  <ProtectedRoute>
                    <EcosystemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/friend"
                element={
                  <ProtectedRoute>
                    <FriendPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/airdrop"
                element={
                  <ProtectedRoute>
                    <AirdropPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <GamesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/spin-wheel"
                element={
                  <ProtectedRoute>
                    <SpinWheelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/levelpage"
                element={
                  <ProtectedRoute>
                    <LevelPage />
                  </ProtectedRoute>
                }
              />
             
            </Routes>
          </Layout>
        </Router>
      </EnergyProvider>
    </PointsProvider>
  );
}

export default App;
