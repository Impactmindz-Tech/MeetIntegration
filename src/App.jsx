import React, { useEffect, useState } from 'react';
import { initClient, handleAuthClick, handleSignoutClick, createGoogleMeet, deleteGoogleMeet } from './googlemeet.js';
import { Button, Container, TextField, Typography } from '@mui/material';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const [eventId, setEventId] = useState('');
  const [duration, setDuration] = useState(30); // Default duration 30 minutes
  const [timerId, setTimerId] = useState(null);

  const updateSignInStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
  };

  useEffect(() => {
    initClient(updateSignInStatus);
  }, []);

  const createMeet = () => {
    const startDateTime = new Date();
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const event = {
      summary: 'Google Meet',
      description: 'One-on-one meeting',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      conferenceData: {
        createRequest: {
          requestId: "sample123",
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          },
        },
      },
    };

    createGoogleMeet(event).then((response) => {
      const meetUrl = response.result.hangoutLink;
      setMeetLink(meetUrl);
      setEventId(response.result.id);

      // Schedule the end of the meeting
      const timer = setTimeout(() => {
        endMeet();
      }, duration * 60000);

      setTimerId(timer);
    });
  };

  const endMeet = () => {
    if (eventId) {
      deleteGoogleMeet(eventId).then(() => {
        resetState();
      });
    }
  };

  const resetState = () => {
    setMeetLink('');
    setEventId('');
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  return (
    <Container>
      {!isSignedIn ? (
        <Button variant="contained" color="primary" onClick={handleAuthClick}>
          Sign In
        </Button>
      ) : (
        <div>
          <Button variant="contained" color="secondary" onClick={handleSignoutClick}>
            Sign Out
          </Button>
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={createMeet}>
            Create Google Meet
          </Button>
          {meetLink && (
            <div>
              <Typography variant="body1">
                Join the meeting: <a href={meetLink}>{meetLink}</a>
              </Typography>
              <Button variant="contained" color="secondary" onClick={endMeet}>
                End Meeting
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default App;