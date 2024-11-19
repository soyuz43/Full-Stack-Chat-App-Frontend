## README.md

## React Frontend Documentation

## Overview

This React frontend provides a user interface for a chat application, allowing users to register, log in, and engage in conversations.

## Components

## Login

- Handles user login functionality
    

- Validates username and password
    

- Stores token in local storage upon successful login
    

## Register

- Handles user registration functionality
    

- Validates username, email, password, and password confirmation
    

- Redirects to login page after successful registration
    

## Header

- Displays application title
    

- Provides login and register links for unauthorized users
    

- Displays logout button for authorized users
    

## ChatInterface

- Displays conversation interface for authorized users
    

- Allows users to send messages
    

## Hooks

## useSession

- Manages session state and API interactions
    

- Handles session creation, deletion, and selection
    

## useMessage

- Manages message state and API interactions
    

- Handles message sending and retrieval
    

## Context

## AuthContext

- Manages authentication state and API interactions
    

- Provides login, logout, and session management functionality
    

## API Interactions

The frontend interacts with the backend API through the following endpoints:

- `POST /login/`: Authenticates a user
    

- `POST /register/`: Registers a new user
    

- `POST /sessions/`: Creates a new session
    

- `GET /sessions/`: Retrieves all sessions
    

- `GET /sessions/<session_id>/`: Retrieves a session by ID
    

- `DELETE /sessions/<session_id>/`: Deletes a session
    

- `POST /sessions/<session_id>/messages/`: Sends a message
    

## Requirements

- React
    

- React Router DOM
    

- Axios
    

## Setup

- Install dependencies: `npm install` or `yarn install`
    

- Start the application: `npm start` or `yarn start`