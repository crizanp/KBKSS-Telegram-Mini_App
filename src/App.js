import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PointsProvider } from "./context/PointsContext";
import { EnergyProvider } from "./context/EnergyContext"; // Import EnergyProvider
import Layout from "./components/Layout";
import TaskList from "./pages/TaskList";
import HomePage from "./pages/HomePage";
import EcosystemPage from "./pages/EcosystemPage";
import FriendPage from "./pages/FriendPage";
import AirdropPage from "./pages/AirdropPage";
import GamesPage from "./pages/GamesPage";
import SpinWheelPage from "./pages/SpinWheelPage";
import LoadingPage from "./components/LoadingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LeaderboardPage from "./pages/LeaderboardPage";
import LevelPage from "./pages/LevelPage";
import BoostsPage from "./pages/BoostsPage";
import AvatarPage from "./pages/AvatarProfile";
import { UserAvatarProvider } from "./context/UserAvatarContext";
import { BackgroundProvider } from "./context/BackgroundContext";
import { UserInfoProvider } from "./context/UserInfoContext";

function App() {
  return (
    <PointsProvider>
        <BackgroundProvider>
        <UserInfoProvider>
      <UserAvatarProvider>
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
                <Route
                  path="/boosts"
                  element={
                    <ProtectedRoute>
                      <BoostsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/avatars"
                  element={
                    <ProtectedRoute>
                      <AvatarPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </EnergyProvider>
      </UserAvatarProvider>
      </UserInfoProvider>

      </BackgroundProvider>
    </PointsProvider>
  );
}

export default App;
