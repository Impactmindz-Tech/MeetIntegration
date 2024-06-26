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

    <> 
    <section>
      <div className="container custom_height">
        <div className="row justify-content-center">
          <div className="col-lg-5 text-center container_custom">
            <div >
              <h1>Let's Have  A Meeting</h1>

            </div>
           {!isSignedIn?(
             <div className='mt-4'>
             <button className='btn custom_btn' onClick={handleAuthClick}>
               SIGN IN

             </button>
             
             </div>
           ):(     <div>
            <button className='btn custom_btn me-5 mt-4' onClick={handleSignoutClick}>
              Sign Out
            </button>
   
            <button className='btn custom_btn mt-4' onClick={createMeet}>
              Create Google Meet
            </button>
            {meetLink && (
              <div>
                <Typography variant="body1">
                  Join the meeting: <a href={meetLink}>{meetLink}</a>
                </Typography>
              
              </div>
            )}
          </div>)}
          </div>
        </div>
      </div>
    </section>
    
   
    </>

  );
};

export default App;