import React, { useState, useMemo, useContext, createContext } from "react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import "./App.css";
import Avatar from "@mui/material/Avatar";
import SearchBar from "./components/SearchBar";
import { FaTwitter } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { GoLink } from "react-icons/go";
import { PiBuildingOfficeLight } from "react-icons/pi";
import IconButton from '@mui/material/IconButton';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const queryClient = new QueryClient();
const ColorModeContext = createContext({ toggleColorMode: () => {} });

function fetchGithubData(userName) {
  return fetch(`https://api.github.com/users/${userName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    });
}

function MyApp() {
  const [userName, setUserName] = useState("");
  const { isLoading, error, data: profileData } = useQuery({
    queryKey: ['githubUser', userName],
    queryFn: () => fetchGithubData(userName),
    enabled: !!userName,
  });

  const handleSubmit = (newUserName) => {
    if (!newUserName) {
      alert("Username can't be null");
      return;
    }
    setUserName(newUserName);
  };

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <div id="outline" style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <nav id="nav">
        <h3>devfinder</h3>
        <pre>{theme.palette.mode} mode
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </pre>
      </nav>
      <br />
      <SearchBar handleSubmit={handleSubmit} />
      <br />
      <div id="card">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>An error occurred: {error.message}</div>
        ) : profileData ? (
          <>
            <div id="profile">
              <Avatar sx={{ width: 90, height: 90 }} alt="Avatar" src={profileData.avatar_url} />
              <div id="profile-text">
                <div id="name-joined">
                  <h2>{profileData.login}</h2>
                  <h4>Joined: {new Date(profileData.created_at).toLocaleDateString()}</h4>
                </div>
                <h3>@{profileData.login}</h3>
              </div>
            </div>
            <div id="other_content">
              <p>{profileData.bio ? profileData.bio : "This profile has no bio"}</p>
              <br />
              <div id="rectangle">
                <span>
                  <div>
                    Followers: <br />
                    <pre>  {profileData.followers}</pre>
                  </div>
                </span>
                <span>
                  <div>
                    Following: <br />
                    <pre>   {profileData.following}</pre>
                  </div>
                </span>
                <span>
                  <div>
                    Repos: <br />
                    <pre>  {profileData.public_repos}</pre>
                  </div>
                </span>
              </div>
              <br />
              <div id="Other1">
                <span>
                  {profileData.location ? (
                    <>
                      <IoLocationSharp /> {profileData.location}
                    </>
                  ) : (
                    <>
                      <IoLocationSharp /> Not Available
                    </>
                  )}
                </span>
                <span>
                  {profileData.twitter_username ? (
                    <>
                      <FaTwitter /> {profileData.twitter_username}
                    </>
                  ) : (
                    <>
                      <FaTwitter /> Not Available
                    </>
                  )}
                </span>
              </div>
              <br />
              <div id="Other2">
                <span>
                  {profileData.blog ? (
                    <>
                      <GoLink /> {profileData.blog}
                    </>
                  ) : (
                    <>
                      <GoLink /> Not Available
                    </>
                  )}
                </span>
                <span>
                  {profileData.company ? (
                    <>
                      <PiBuildingOfficeLight /> {profileData.company}
                    </>
                  ) : (
                    <>
                      <PiBuildingOfficeLight /> Not Available
                    </>
                  )}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === 'light' ? '#ffffff' : '#060730', // Light: white, Dark: dark blue
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#ffffff', // Light: black, Dark: white
          },
        },
      }),
    [mode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <MyApp />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}